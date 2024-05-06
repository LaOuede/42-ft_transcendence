
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
    
    def get(self, request):
        return Response({"user": request.user.username,})
    
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

class GameDelete(APIView):
    @authentication_classes([JWTAuthentication])
    def get_game(self, game_id):
        return get_object_or_404(Game, id=game_id)

    def get(self, request, game_id):
        game = self.get_game(game_id)
        serializer = GameSerializer(game)
        return Response(serializer.data)
    
    def delete(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
            game.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Game.DoesNotExist:
            return Response({"detail": "Game not found."}, status=status.HTTP_404_NOT_FOUND)


class GameGetOne(APIView):
    @authentication_classes([JWTAuthentication])
    def get(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
            serializer = GameSerializer(game)
            return Response(serializer.data)
        except Game.DoesNotExist:
            return Response({"detail": "Game not found."}, status=status.HTTP_404_NOT_FOUND)

class GameGetAll(APIView):
    @authentication_classes([JWTAuthentication])
    def get(self, request):
        games = Game.objects.all()
        if not games:
            return Response({"detail": "No games found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GameUpdate(APIView):
    @authentication_classes([JWTAuthentication])
    def get_game(self, game_id):
        return get_object_or_404(Game, id=game_id)

    @authentication_classes([JWTAuthentication])
    def get(self, request, game_id):
        game = self.get_game(game_id)
        serializer = GameSerializer(game)
        return Response(serializer.data)
    @authentication_classes([JWTAuthentication])
    def patch(self, request, game_id):
        game = self.get_game(game_id)
        serializer = GameSerializer(game, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# {
#     "player1_id": 1,
#     "player2_id": 2
# }