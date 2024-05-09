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

    @property
    def fmt(self):
        return self.created_at.strftime("%Y-%m-%d")

    @property
    def type(self):
        GAME_TYPES = {
            "NORM": "1 Vs. 1",
            "RMBL": "Rumble",
            "TOUR": "Tournois",
        }
        return GAME_TYPES[self.game_type]

    
class GamePlayer(models.Model):

    player = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

    is_winner = models.BooleanField(null=False, blank=False)
    score = models.IntegerField(null=True, blank=True)
    rank = models.IntegerField(null=True, blank=True)

    @property
    def color(self):
        return "#88AD40" if self.is_winner else "#9D2406"