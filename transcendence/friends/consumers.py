import json
from random import randint
from time import sleep

from channels.generic.websocket import WebsocketConsumer

GREEN = "\033[33m"
RESET = "\033[00m"
RED = "\031[31m"


class WSConsumer(WebsocketConsumer):

    active_connections = set()

    def connect(self):
        print(GREEN + "Connection to WebSocket" + RESET)
        self.accept()
        self.active_connections.add(self)

    def disconnect(self, code):
        print(RED + "[33mConnection to WebSocket" + RESET)
        self.active_connections.remove(self)
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        print(GREEN + "WS Recieved : ", text_data, RESET)
        if text_data:
            self.send_to_all(text_data)
        else:
            print(RED, "No text_data", RESET)

    def send_to_all(self, text_data):
        print("Sending to : {len(self.active_connections)}")
        for client in self.active_connections:
            client.send(text_data)