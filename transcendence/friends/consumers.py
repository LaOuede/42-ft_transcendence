import json
from random import randint
from time import sleep

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from django.utils.translation import activate, gettext as _

def get_user_private_group(user):
    return f"private_group_{user.pk}"

class WSConsumer(WebsocketConsumer):

    broadcast_group = "broadcast_group"
    joined_groups = []

    def connect(self):
        user = self.scope.get("user")

        private_group = get_user_private_group(user)
        self.add_to_group(private_group)
        self.add_to_group(self.broadcast_group)

        self.accept()

    def disconnect(self, code):
        user = self.scope["user"]
        self.leave_all_groups()

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)

    def notification(self, event):
        # Get receipient language
        self.send(
            json.dumps(event)
        )

    def refresh(self, event):
        self.send(
            json.dumps(event)
        )

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