import json
from random import randint
from time import sleep

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

GREEN = "\033[33m"
RESET = "\033[00m"
RED = "\033[31m"
BLUE = "\033[36m"


def get_user_private_group(user):
    return f"private_group_{user.pk}"

class WSConsumer(WebsocketConsumer):

    user_activity_group = "user_activity"

    def connect(self):
        user = self.scope.get("user")

        print(GREEN + f"[DEBUG] Connection to WebSocket from {user}" + RESET)

        # Join group
        async_to_sync(self.channel_layer.group_add)(
            self.user_activity_group, self.channel_name
        )

        private_group = get_user_private_group(user)
        async_to_sync(self.channel_layer.group_add)(
            private_group, self.channel_name
        )
        print(f"[DEBUG] {user.username} added to {private_group}")
        self.accept()

    def disconnect(self, code):
        print(RED + "Connection to WebSocket" + RESET)
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
