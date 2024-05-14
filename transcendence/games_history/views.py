
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, authentication_classes
from .models import Game
from user.models import User
from .serializers import GameSerializer, UserSerializer, GamePlayerSerializer

class CreateGame(APIView):

    def post(self, request):

        if not request.user.is_authenticated:
            return Response("You are note authentified  ")

        data = request.data
        game_serializer = GameSerializer(data=data)

        if not game_serializer.is_valid():
            return Response(game_serializer.errors)

        game = game_serializer.save()

        player_serializer = GamePlayerSerializer(data=data)
        player_serializer.initial_data["player"] = request.user.pk
        player_serializer.initial_data["game"] = game.pk

        if not player_serializer.is_valid():
            game.delete()
            return Response(player_serializer.errors)

        player_serializer.save(game=game)
        serializer = GameSerializer(game)
        return Response(serializer.data, status=status.HTTP_201_CREATED)