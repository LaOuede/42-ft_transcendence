from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User, Game

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class GameSerializer(serializers.ModelSerializer):
    player1 = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    player2 = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Game
        fields = ['id', 'player1', 'player2', 'player1_score', 'player2_score', 'winner', 'loser', 'created_at']