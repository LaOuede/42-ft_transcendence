from django.db import models
from user.models import User

class Game(models.Model):

    GAME_TYPES = [
        ("NORM", "Normal"),
        ("RMBL", "Rumble"),
        ("TOUR", "Tournois"),
    ]

    players = models.ManyToManyField(User, through='GamePlayer', related_name="played_games")
    game_type = models.CharField(max_length=10, choices=GAME_TYPES, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Type: {self.game_type} Players: ..."
    
class GamePlayer(models.Model):

    player = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

    is_winner = models.BooleanField(null=False, blank=False)
    score = models.IntegerField(null=True, blank=True)
    rank = models.IntegerField(null=True, blank=True)
