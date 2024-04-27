from .models import FriendList

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from friends.consumers import WSConsumer


def get_friends_of(user):
    if not user:
        return None
    try:
        friends = FriendList.objects.get(user=user).friends.all()
        return friends
    except:
        return None


def broadcast_status_update(user, status):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        WSConsumer.user_activity_group,
        {
            "type": "change.status",
            "message": {"username": user.username, "status": status},
        },
    )


def ping_websocket():
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        WSConsumer.user_activity_group,
        {
            "type": "change.status",
            "message": "None",
        },
    )
