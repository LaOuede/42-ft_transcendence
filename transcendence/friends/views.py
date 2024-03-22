from django.shortcuts import render
from user.models import User

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# from .serializers import UserSerializer
from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import AddFriendSerializer

# from custom_auth.views import get_user_from_token
# from django.http import JsonResponse

# Create your views here.
def FriendsListView(request):

    allUsers = User.objects.filter(is_staff=False)
    
    activity_enum = {e[0]: e[1] for e in User.activity_enum}

    return render(
        request, "friends/list.html",
        {
            "friends_list": allUsers,
            "activity_enum": activity_enum
        }
    )

# @authentication_classes([JWTAuthentication])
class FriendRequest(APIView):
    # def post(self, request):
        # Response ({"methode": "POST", })

    def get(self, request, *args, **kwargs):
        return Response (
            {"status": "success", "metode": "GET"},
            status.HTTP_200_OK    
        )
    
    def post(self, request, *args, **kwargs):
        serializer = AddFriendSerializer(data=request.data)
        if serializer.is_valid():
            return Response (
                {"status": "success", "metode": "POST", "message":"Valid friend request"},
                status.HTTP_200_OK    
            )
        return Response (
            {"status": "fail", "metode": "POST", "message":"Invalid friend request"},
            status.HTTP_200_OK    
        )
