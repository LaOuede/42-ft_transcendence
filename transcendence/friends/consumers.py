import json
from random import randint
from time import sleep

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

GREEN = "\033[33m"
RESET = "\033[00m"
RED = "\033[31m"
BLUE = "\033[36m"



class WSConsumer(WebsocketConsumer):

    user_activity_group = "user_activity"

    def connect(self):
        print(GREEN + "[DEBUG] Connection to WebSocket" + RESET)

        # Join group
        async_to_sync(self.channel_layer.group_add)(
            self.user_activity_group, self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        print(RED + "[33mConnection to WebSocket" + RESET)
        async_to_sync(self.channel_layer.group_discard)(
            self.user_activity_group, self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        print(GREEN + "WS Recieved : ", text_data, RESET)
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")

        print(GREEN, "Received text_data: ", text_data, RESET)

        async_to_sync(self.channel_layer.group_send)(
            self.user_activity_group, {"type": "change.status", "message": message}
        )

    def change_status(self, event):
        message = event.get("message")
        print(GREEN, "Received Group chat message: ", message, RESET)
        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))
