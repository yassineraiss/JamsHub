import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.groupe_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.groupe_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.groupe_name,
            {
                'type': 'tester_message',
                'tester': 'Hello Chat!!'
            }
        )

    async def tester_message(self, event):
        tester = event['tester']

        await self.send(text_data=json.dumps({
            'tester': tester
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.groupe_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.groupe_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

class SynchRoomConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.groupe_name = 'sync_%s' % self.room_code

        await self.channel_layer.group_add(
            self.groupe_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.groupe_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.groupe_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

class VotesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.groupe_name = 'vote_%s' % self.room_code

        await self.channel_layer.group_add(
            self.groupe_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.groupe_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.groupe_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

class GuestsConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        """
        Handles WebSocket connection by adding the channel to the room's group
        and notifying all clients about the new guest connection.
        """
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.group_name = 'guest_%s' % self.room_code

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'guest_connected',
            }
        )

    async def disconnect(self, close_code):
        """
        Handles WebSocket disconnection by notifying all clients about the
        guest disconnection and removing the channel from the room's group.
        """
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'guest_disconnected',
            }
        )

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def guest_connected(self, event):
        """
        Sends a message to the client indicating that a new guest has connected.
        """
        await self.send(text_data=json.dumps({
            'message': 'connected'
        }))

    async def guest_disconnected(self, event):
        """
        Sends a message to the client indicating that a guest has disconnected.
        """
        await self.send(text_data=json.dumps({
            'message': 'disconnected'
        }))

    async def receive(self, text_data):
        """
        Receives data from the client (if any). Not used in this consumer.
        """
        pass