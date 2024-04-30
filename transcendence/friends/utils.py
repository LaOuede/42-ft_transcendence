from .models import FriendList

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from friends.consumers import WSConsumer, get_user_private_group


def get_friends_of(user):
    if not user:
        return None
    try:
        friends = FriendList.objects.get(user=user).friends.all()
        return friends
    except:
        return None


def broadcast_status_update(user, status, message="None"):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        WSConsumer.broadcast_group,
        {
            "type": "change.status",
            "data": {"username": user.username, "status": status},
            "message": message,
        },
    )


def ws_send_private_message(user, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        get_user_private_group(user),
        data
    )


def ping_websocket():
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        WSConsumer.broadcast_group,
        {
            "type": "change.status",
            "message": "WebSocket Pinged",
        },
    )
