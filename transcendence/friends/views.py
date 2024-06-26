from django.shortcuts import render, get_object_or_404, HttpResponse
from django.http import Http404

from user.models import User
import json

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

# from .serializers import UserSerializer
from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import FriendRequest
from friends.utils import get_friends_of
from custom_auth.views import get_user_from_token

from friends.utils import broadcast_refresh, notify_users

from django.utils.translation import activate, gettext_lazy as _

from user.views import activateLanguage



def index(request):
    return render(
        request,
        "friends/index.html",
    )


# Create your views here.
@authentication_classes([JWTAuthentication])
def FriendsListView(request):

    # friends = User.objects.filter(is_staff=False) # All users
    user = get_user_from_token(request)
    if not (user and user.is_authenticated):
        return HttpResponse("User note authenticated")
    friends = get_friends_of(user)
    invites_in = [req.from_user for req in user.invites_in.filter(is_active=True)]
    invites_out = [req.to_user for req in user.invites_out.filter(is_active=True)]

    return render(
        request,
        "friends/list.html",
        {
            "friends_list": friends,
            "invites_in": invites_in,
            "invites_out": invites_out,
        },
    )


class FriendRequestView(APIView):
    """
    Handels get request. Created for testing, can be deleted
    """

    @authentication_classes([JWTAuthentication])
    def get(self, request, *args, **kwargs):
        sender = request.user
        return Response({"user": sender.username}, status=200)

    """
    Handles Post request. expected use for this API endpoint
    Checks the 'action' field in the received data, and executes the according
    function.
    """

    
    def post(self, request, *args, **kwargs):
        
        activateLanguage(request)
        action = request.data.get("action")
        sender = request.user
        other = self._get_other_user(request, action)

        if not (other and other.username):
            return Response({"error": "User not found"}, status=404)

        broadcast_refresh()

        if action == "add" or action == "accept":
            return self.add_friend(sender, other)

        if action == "delete":
            notify_users(
                [sender],
                _("You and %(other)s are no longer friends"),
                other=other.username,
            )
            notify_users(
                [other],
                _("You and %(sender)s are no longer friends"),
                sender=sender.username,
            )
            return self.delete_friend(sender, other)

        if action == "cancel":
            return self.cancel_invite(sender, other)

        if action == "decline":
            return self.decline_invite(sender, other)

        return Response({"Message": "Action no set properly"}, status=404)

    def add_friend(self, sender, receiver):

        if self._is_same_user(sender, receiver):
            return Response({"error": _("Can't add yourself")}, status=status.HTTP_200_OK)

        if self._request_already_exists(sender, receiver):
            return Response(
                {"error": _("Request already sent")}, status=status.HTTP_200_OK
            )

        if self._already_friends(sender, receiver):
            return Response({"error": _("Already friends")}, status=status.HTTP_200_OK)

        friend_request = FriendRequest(from_user=sender, to_user=receiver)
        friend_request.save()

        # self.auto_accept_invite(friend_request)
        if friend_request._active_mirror():
            friend_request.accept()
            friend_request._active_mirror().accept()
            notify_users(
                [receiver],
                _("You are now friends with: %(user)s!"),
                user=sender.username,

            )
            notify_users(
                [sender],
                _("You are now friends with: %(user)s!"),
                user=receiver.username,
            )
        else:
            pass
            notify_users(
                [receiver],
                _("New friend request from: %(user)s!"), user=receiver.username
            )
            notify_users(
                [sender],
                _("Friend request sent to: %(user)s!"), user=receiver.username
            )

        return Response(
            {"message": "success", "status": "201"}, status=status.HTTP_201_CREATED
        )

    def delete_friend(self, sender, other):
        # Errors
        # If other does not exist
        # If other is not a friend

        # delete friendship
        sender.friends_list.unfriend(other)

        return Response({"message": "friend deleted"}, status=status.HTTP_200_OK)

    def decline_invite(self, sender, other):

        friend_request = FriendRequest.objects.filter(
            from_user=other, to_user=sender, is_active=True
        ).first()
        if friend_request:
            friend_request.decline()

        return Response(
            {"message": "Friend Request Canceled"}, status=status.HTTP_200_OK
        )

    def cancel_invite(self, sender, other):
        friend_request = FriendRequest.objects.filter(
            from_user=sender, to_user=other, is_active=True
        ).first()
        if friend_request:
            friend_request.cancel()

        return Response(
            {"message": "Friend Request Canceled"}, status=status.HTTP_200_OK
        )

    def _is_same_user(self, sender, receiver):
        return sender == receiver

    def _request_already_exists(self, sender, receiver):
        return FriendRequest.objects.filter(
            from_user=sender, to_user=receiver, is_active=True
        ).exists()

    def _already_friends(self, sender, receiver):
        try:
            return sender.friends_list.is_friends_with(receiver)
        except:
            return False

    def _get_other_user(self, request, action):

        if "friend_id" in request.data.keys():
            return get_object_or_404(
                User,
                pk=request.data.get("friend_id"),
                is_staff=False,
            )

        if "friend_username" in request.data.keys():
            user =  get_object_or_404(
                User,
                username=request.data.get("friend_username"),
                is_staff=False,
            )
            return user
        
        raise Http404