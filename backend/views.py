from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from requests import Request, post, put, get
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from .models import *
from .serializers import *
from .credentials import *
from .util import *

# User register view:

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GetUsername(APIView): 
    def get(self, request):
        return Response(request.user.username, status=status.HTTP_200_OK)

# Room views:

class ListCreateRoom(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    permission_classes= [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
        
    def get_queryset(self):
        user = self.request.user
        return Room.objects.filter(host=user)
    
class HandleRoom(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        room_code = self.kwargs.get('room_code')
        try:
            return Room.objects.get(code=room_code)
        except Room.DoesNotExist:
            raise NotFound(f'Room with code {room_code} does not exist')
    
# Spotify Views:

class AuthURL(APIView): #Returns a URL that we can go to, to authenticate our spotify application.
    def get(self, request, format=None):
        scopes =  "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing"
        state = self.request.user.username

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'state': state
        }).prepare().url

        return  Response({'url': url}, status=status.HTTP_200_OK)
    

def spotify_callback(request):    
    code = request.GET.get('code')
    state = request.GET.get('state')
    user = User.objects.get(username=state)

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    update_create_user_tokens(
        user,
        access_token, 
        token_type,  
        expires_in,
        refresh_token
    )

    return redirect(REDIRECT_URL)

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        user = self.request.user
        is_authenticated = is_spotify_authenticated(user)
        print(f'is authenticted is : {is_authenticated}')
        if is_authenticated:
            return Response({ 'access_token': is_authenticated }, status=status.HTTP_200_OK)
        
        return Response({'message': 'user is not authenticated'}, status=status.HTTP_204_NO_CONTENT)

class StartOrResumeSong(APIView):
    def get(self, request, album_id, track_id, format=None):
        print('hello')
        user = request.user
        token = is_token_valid(user)
        headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + token}
        data = {
            "context_uri": "spotify:album:" + album_id,
            "offset" : {
                "uri": "spotify:track:" + track_id
            },
            "position_ms": 0
        }
        
        response = put(BASE_URL + 'player/play', headers=headers, json=data)
        if response.status_code in range(200, 299):
            return Response({'message': 'Song started or resumed successfully'}, status=status.HTTP_200_OK)
        elif response.status_code == 301:
            return Response({'error': 'Redirect', 'location': response.headers['Location']}, status=status.HTTP_301_MOVED_PERMANENTLY)
        else:
            return Response({'error': 'Failed to start or resume song', 'details': response.json()}, status=response.status_code)
    
class SearchView(APIView):
    def get(self, request, query):
        user = request.user
        token = is_token_valid(user)
        
        if token:
            headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + token}
            response = get('https://api.spotify.com/v1/search?q=' + query + '&type=artist,track,episode,show', headers=headers)
            print(response)
            
            if response.status_code == 200:
                search_results = response.json().get('tracks')
                return Response(search_results, status=status.HTTP_200_OK)
            else:
                # Handle other status codes appropriately
                error_message = response.json().get('error')
                return Response(error_message, status=response.status_code)
        else:
            return Response({'error': 'Access token not found'}, status=status.HTTP_401_UNAUTHORIZED)

class AddVote(APIView):
    def post(self, request, room_code, format=None):
        user = request.user
        room = Room.objects.filter(code=room_code)[0]
        if room:
            vote = Vote01.objects.filter(user=user, room=room)
            if vote.exists():
                return Response({'message':'already voted'}, status=status.HTTP_302_FOUND)
            else:
                new_vote = Vote01(user=user, room=room)
                new_vote.save()
                total_votes = Vote01.objects.filter(room=room).count()
                if total_votes < room.votes_to_skip:
                    return Response({'message':'vote added'}, status=status.HTTP_201_CREATED)
                else:
                    Vote01.objects.filter(room=room).delete() 
                    return Response({'message':'skip song'}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
class AddOrDeleteGuest(APIView):
    def post(self, request, room_code, format=None):
        user = request.user
        try:
            room = get_object_or_404(Room, code=room_code)
            # Check if the guest already exists (optional)
            if Guest01.objects.filter(user=user, room=room).exists():
                return Response({'error': 'Guest already exists'}, status=status.HTTP_400_BAD_REQUEST)
            Guest01.objects.create(user=user, room=room)
            return Response({'message': 'Guest created'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, room_code, format=None):
        user = request.user
        try:
            room = get_object_or_404(Room, code=room_code)
            guest = get_object_or_404(Guest01, user=user, room=room)
            guest.delete()
            return Response({'message': 'Guest deleted'}, status=status.HTTP_200_OK)
        except Guest01.DoesNotExist:
            return Response({'error': 'Guest not found'}, status=status.HTTP_404_NOT_FOUND)
        except Room.DoesNotExist:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)