from django.contrib import admin
from .models import Game

class GameAdmin(admin.ModelAdmin):
	list_display = ('id', 'player1', 'player1_score', 'player2', 'player2_score', 'winner')

admin.site.register(Game, GameAdmin)