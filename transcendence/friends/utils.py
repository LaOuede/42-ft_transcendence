from .models import FriendList


def get_friends_of(user):
        try:
            friends = FriendList.objects.get(user=user).friends.all()
            print(f"{user.username}: {friends}")
            return friends
        except:
            print(f"{user.username}: NO FRIENDS")
            return None