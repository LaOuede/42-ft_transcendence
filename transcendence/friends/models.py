from django.db import models
from django.conf import settings

class FriendList(models.Model):
    user    = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user")
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="friends")

    def __str__(self):
        return self.user.username

    def add_friend(self, account):
        """
        Add a new friend
        """
        if not account in self.friends.all():
            print(f"\033[33m[ DEBUG ] {self.user.username} Added {account.username} as a friend!\033[00m")
            self.friends.add(account)
            self.save()

    def remove_friend(self, account):
        """
        Remove a friend
        """
        print(f"\033[33m[ DEBUG ] {self.user.username} Removed {account.username} from his friend!\033[00m")
        if account in self.friend.all():
            self.friend.remove(account)

    def unfriend(self, other):
        """
        Initiate the action of unfriending someone
        """

        remover_friend_list = self
        remover_friend_list.remove_friend(other)

        others_friend_list = FriendList.objects.get(user=other)
        others_friend_list.remove_friend(self.user)

        print(f"\033[33m[ DEBUG ] {self.user.username} And {other.username} Are no longer friends\033[00m")

    def is_mutual_friend(self, friend):
        return friend in self.friends.all()



class FriendRequest(models.Model):
    from_user   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="from_user")
    to_user     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="to_user")
    is_active   = models.BooleanField(blank=True, null=False, default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        # unique_together = ('from_user', 'to_user')
        pass

    def __str__(self):
        return f"from:{self.from_user} to:{self.to_user}"

    def accept(self):
        """
        Accept a friend request
        """

        print(f"\033[33m[ DEBUG ] {self.to_user.username} accepted {self.from_user.username}'s freind request\033[00m")

        receiver_friend_list = FriendList.objects.get_or_create(user=self.to_user)[0]
        sender_friend_list = FriendList.objects.get_or_create(user=self.from_user)[0]
        receiver_friend_list.add_friend(self.from_user)
        sender_friend_list.add_friend(self.to_user)
        self.is_active = False
        self.save()

    def decline(self):
        """
        Decline a friend request
        """
        print(f"\033[33m[ DEBUG ] {self.to_user.username} declined {self.from_user.username}'s freind request\033[00m")

        self.is_active = False
        self.save()

    def cancel(self):
        """
        Cancle a friend request
        """
        print(f"\033[33m[ DEBUG ] {self.from_user.username} canceled their request to {self.to_user.username}\033[00m")

        self.is_active = False
        self.save()

