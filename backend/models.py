from django.db import models
from django.contrib.auth.models import User
import string, random

def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

# Create your models here.

class Room(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hosted_rooms")
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    guest_can_pause = models.BooleanField(null=False)
    votes_to_skip = models.IntegerField(null=False, default=1)

class SpotifyToken01(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_tokens01')
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150, null=True)
    access_token = models.CharField(max_length=150, null=True)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50, null=True)

class Vote01(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_votes01')
    created_at = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room_votes01')

class Guest01(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_guests01')
    created_at = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room_guests01')