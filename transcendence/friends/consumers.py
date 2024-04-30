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

    broadcast_group = "ser_activity"
    joined_groups = []

    def connect(self):
        user = self.scope.get("user")

        print(GREEN + f"[DEBUG] Connection to WebSocket from {user}" + RESET)

        private_group = get_user_private_group(user)
        self.add_to_group(private_group)
        self.add_to_group(self.broadcast_group)

        self.accept()

    def disconnect(self, code):
        user = self.scope["user"]
        print(RED + f"[WebSocker] Disconnect {user.username} - {code}" + RESET)
        self.leave_all_groups()

    def receive(self, text_data=None, bytes_data=None):
        print(GREEN + "WS Recieved : ", text_data, RESET)
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")

        print(GREEN, "Received text_data: ", text_data, RESET)
        print(GREEN, "message: ", message, RESET)


        if message == "notify":
            async_to_sync(self.channel_layer.group_send)(
                self.broadcast_group, {"type": "notification", "message": message}
            )

    def notification(self, event):
        data = json.dumps({"message": "This is a notification message"})
        print(GREEN, f"{event=}", RESET)
        self.send(data)

    def refresh(self, event):
        data = json.dumps({"message": "This is a refresh message"})
        self.send(data)

    def add_to_group(self, group_name):
        self.joined_groups.append(group_name)
        async_to_sync(self.channel_layer.group_add)(
            group_name, self.channel_name
        )

    def leave_all_groups(self):
        for group in self.joined_groups:
            async_to_sync(self.channel_layer.group_discard)(
                group, self.channel_name
            )