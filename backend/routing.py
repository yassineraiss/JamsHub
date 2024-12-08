from django.urls import re_path
from .consumers import *

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_code>\w+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/sync/(?P<room_code>\w+)/$', SynchRoomConsumer.as_asgi()),
    re_path(r'ws/vote/(?P<room_code>\w+)/$', VotesConsumer.as_asgi()),
    re_path(r'ws/guest/(?P<room_code>\w+)/$', GuestsConsumer.as_asgi())
]