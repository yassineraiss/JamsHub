from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('user/create/', RegisterUserView.as_view(), name='create-user'),
    path('username/', GetUsername.as_view(), name='username'),
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    # Room urls:
    path('room/create-list/', ListCreateRoom.as_view(), name='create-list-room'),
    path('room/handle/<str:room_code>/', HandleRoom.as_view(), name='handle-room'),
    # Spotify urls:
    path('get-auth-url/', AuthURL.as_view()),
    path('redirect/',spotify_callback),
    path('is_authenticated/', IsAuthenticated.as_view()),
    path('start/<str:album_id>/<str:track_id>/', StartOrResumeSong.as_view()),
    path('search/<str:query>/', SearchView.as_view()),
    # Vote url
    path('vote/<str:room_code>/', AddVote.as_view()),
    # Guest url
    path('guest/<str:room_code>/', AddOrDeleteGuest.as_view())
]
