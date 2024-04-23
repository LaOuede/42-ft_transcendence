from django.shortcuts import render, get_object_or_404

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

from friends.utils import ping_websocket

def index(request):
    return render(request, "friends/index.html",)

# Create your views here.
@authentication_classes([JWTAuthentication])
def FriendsListView(request):

    # friends = User.objects.filter(is_staff=False) # All users
    user = get_user_from_token(request)
    friends = get_friends_of(user) if user else None
    # invites_out = FriendRequest
    # invites_in = FriendRequest

    return render(
        request,
        "friends/list.html",
        {"friends_list": friends, "sent_requests": None},)

class FriendRequestView(APIView):
    @authentication_classes([JWTAuthentication])
    def get(self, request, *args, **kwargs):
        sender = request.user
        return Response({"user": sender.username}, status=200)

    def post(self, request, *args, **kwargs):
        print("\033[31m", "[DEBUG] request.data: ", request.data)
        if (request.data.get("action", None) == "add"):
            print("\033[m31", "[DEBUG] Adding user", request.user)
            return self.add_friend(request)

        if (request.data.get("action", None) == "delete"):
            return self.delete_friend(request)

        return Response({"Message": "Action no set properly"}, status=404)

    def add_friend(self, request):
        sender = request.user
        receiver = get_object_or_404(
            User, username=request.data.get("friend_username", None)
        )

        print("\033[31m", "[DEBUG] Adding user", sender.username, receiver.username)
        if self._is_same_user(sender, receiver):
            return Response(
                {"message": "Can't add yourself"}, status=status.HTTP_400_BAD_REQUEST
            )

        # if self._request_already_exists(sender, receiver):
        #     return Response(
        #         {"message": "Request already sent"}, status=status.HTTP_400_BAD_REQUEST
        #     )

        friend_request = FriendRequest(from_user=sender, to_user=receiver)
        self.auto_accept_invite(friend_request)
        return Response(
            {"message": "success", "status": "201"},
            status=status.HTTP_201_CREATED
        )

    def delete_friend(self, request):
        sender = request.user
        other = get_object_or_404(User, pk=request.data.get("friend_id", None))
        print("\033[31m", "[DEBUG] Deleting friend", sender.username, other.username)
        # Errors
            # If other does not exist
            # If other is not a friend

        # delete friendship
        sender.friends_list.unfriend(other)

        ping_websocket()
        return Response({"message": "friend deleted"}, status=status.HTTP_200_OK)

    def auto_accept_invite(self, friend_request):
        """
        Accepte automatiquement la demande d'ami
        Change/supprimer cette fonction si on veut laisser le choix au receiver
        """
        friend_request.accept()
        friend_request.save()

    def _is_same_user(self, sender, receiver):
        return sender == receiver

    def _request_already_exists(self, sender, receiver):
        return FriendRequest.objects.filter(from_user=sender, to_user=receiver).exists()