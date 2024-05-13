from .models import FriendList

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from friends.consumers import WSConsumer, get_user_private_group

from django.utils import translation

def get_friends_of(user):
    if not user:
        return None
    try:
        friends = FriendList.objects.get(user=user).friends.all()
        return friends
    except:
        return None


def broadcast_refresh():
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        WSConsumer.broadcast_group,
        {
            "type": "refresh",
            "message": "",
        },
    )


def ws_send_private_message(user, data):
    channel_layer = get_channel_layer()
    return async_to_sync(channel_layer.group_send)(
        get_user_private_group(user),
        data
    )

def notify_users(users, message, **kwargs):
    for user in users:
        translation.activate(user.language)
        translated = str(message % kwargs)
        ws_send_private_message(user, {
            'type': 'notification',
            'message': translated
        })
        translation.deactivate()


def broadcast_message(message):
    message = {
        'type': 'broadcast',
        'message': message
    }
    async_to_sync(get_channel_layer().group_send)(WSConsumer.broadcast_group, message)


def getlang(user):

    ws_send_private_message(
        user, 
        {
            'type': 'lang',
    })