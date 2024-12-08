from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    '''
    Why using the create() method ?
    By overriding the create method in the UserSerializer, I can utilize the create_user 
    method of the User model, which takes care of password hashing and any other user-specific
    creation logic.
    This override ensures that when a new user is created through the API, the password is 
    properly hashed and the user instance is created correctly.
    '''
    def create(self, validated_data):  
        user = User.objects.create_user(**validated_data)
        return user 

class RoomSerializer(serializers.ModelSerializer):
    host_username = serializers.SerializerMethodField()
    room_guests = serializers.SerializerMethodField()
    room_votes = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = ['id', 'host', 'host_username', 'code', 'votes_to_skip', 'guest_can_pause', 'room_guests', 'room_votes']
        extra_kwargs = {
            'host': {'read_only': True},
            'code': {'read_only': True}
        }

    def get_host_username(self, obj):
        return obj.host.username
    
    def get_room_guests(self, obj):
        return Guest01.objects.filter(room=obj).count()
    
    def get_room_votes(self, obj):
        return Vote01.objects.filter(room=obj).count()
    


        