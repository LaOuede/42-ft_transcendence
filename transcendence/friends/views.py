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
        data = json.loads(request.body) 
        return Response({"data": data.receiver})
        sender = request.user
        receiver = get_object_or_404(
            User, username=request.data.get("friend_username", None)
        )

        if sender == receiver:
            return Response(
                {"message": "can't add yourself", "status": "403"}, status=status.HTTP_403_FORBIDDEN
            )

        friend_request = FriendRequest(from_user=sender, to_user=receiver)
        self.auto_accept_invite(friend_request)
        return Response(
            {"message": "success", "status": "201"},
            status=status.HTTP_201_CREATED
        )

    def auto_accept_invite(self, friend_request):
        """
        Accepte automatiquement la demande d'ami
        Change/supprimer cette fonction si on veut laisser le choix au receiver
        """
        friend_request.accept()
        friend_request.save()
