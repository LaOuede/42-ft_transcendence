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
from .serializers import GameSerializer, UserSerializer

class CreateGame(APIView):
    @authentication_classes([JWTAuthentication])
    def post(self, request):
        player1_id = request.data.get('player1_id')
        player2_id = request.data.get('player2_id')
        
        if not player1_id or not player2_id:
            return Response({"error": "Both player1_id and player2_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            player1 = User.objects.get(pk=player1_id)
            player2 = User.objects.get(pk=player2_id)
        except User.DoesNotExist:
            return Response({"error": "One or both players not found"}, status=status.HTTP_404_NOT_FOUND)

        game = Game.objects.create(player1=player1, player2=player2)
        game.save()
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