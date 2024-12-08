from .models import SpotifyToken01
from .credentials import *
from requests import post
from datetime import timedelta
from django.utils import timezone

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(user):
    user_tokens = SpotifyToken01.objects.filter(user=user)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None
    
def update_create_user_tokens(user, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(user)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken01(user=user, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()

def is_spotify_authenticated(user):
    tokens = get_user_tokens(user)
    if tokens:
        if timezone.now() < tokens.expires_in:
            return tokens.access_token
        else: 
            refresh_spotify_token(user)

    return False

def refresh_spotify_token(user):
    refresh_token = get_user_tokens(user).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_create_user_tokens(
        user, access_token, token_type, expires_in, refresh_token)
    
    return access_token
    
def is_token_valid(user):
    tokens = get_user_tokens(user)
    if timezone.now() < tokens.expires_in:
        return tokens.access_token
    else: 
        refresh_spotify_token(user)