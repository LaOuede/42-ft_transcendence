from django.shortcuts import render, get_object_or_404

from user.models import User

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# from .serializers import UserSerializer
from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import FriendRequest


# Create your views here.
def FriendsListView(request):

    allUsers = User.objects.filter(is_staff=False)

    activity_enum = {e[0]: e[1] for e in User.activity_enum}

    return render(
        request,
        "friends/list.html",
        {"friends_list": allUsers, "activity_enum": activity_enum},)

class FriendRequestView(APIView):
    @authentication_classes([JWTAuthentication])
    def get(self, request, *args, **kwargs):
        sender = request.user
        return Response({"user": sender.username}, status=200)

    def post(self, request, *args, **kwargs):
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
