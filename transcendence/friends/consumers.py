import json
from random import randint
from time import sleep

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

GREEN = "\033[32m"
YELLOW = "\033[33m"
RESET = "\033[00m"
RED = "\033[31m"
BLUE = "\033[36m"


def get_user_private_group(user):
    return f"private_group_{user.pk}"

class WSConsumer(WebsocketConsumer):

    broadcast_group = "broadcast_group"
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
        print(RED + f"[WebSocker] Disconnect User:{user.username} - code:{code}" + RESET)
        self.leave_all_groups()



    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        print(GREEN + "[WebSocket] Recieved : ", data, RESET)

        if data.get("type") == "ping":
            print(f"[WebSocket] PING from {self.scope.get('user')}" )

    def notification(self, event):
        self.send(
            json.dumps(event)
        )

    def refresh(self, event):
        self.send(
            json.dumps(event)
        )



    def add_to_group(self, group_name):
        
        self.joined_groups.append(group_name)
        print(GREEN + f"[WebSocket] {self.scope['user'].username} added to group {group_name}" + RESET)
        async_to_sync(self.channel_layer.group_add)(
            group_name, self.channel_name
        )

    def leave_all_groups(self):
        for group in self.joined_groups:
            print(YELLOW + f"[WebSocket] {self.scope['user'].username} removed from group {group}" + RESET)
            async_to_sync(self.channel_layer.group_discard)(
                group, self.channel_name
            )