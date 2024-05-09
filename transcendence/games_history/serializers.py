from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User, Game, GamePlayer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'game_type', 'players']

class GamePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamePlayer
        fields = ['player', 'game', 'is_winner', 'score', 'rank']