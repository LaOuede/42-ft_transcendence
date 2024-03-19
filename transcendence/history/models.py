from django.db import models
from user.models import User

# Create your models here.
    

# If A user is created, he is replaced by the fake user
# User(name=DELETED_UNAME)

class Game(models.Model):
    players = models.ManyToManyField(User, through="Score")
    tournament = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game #{self.id}: {[p.username for p in self.players.all()]}"


class Score(models.Model):
    player = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    is_winner = models.BooleanField(default=False)
    tournament_score = models.IntegerField(default=-1)

    def __str__(self):
        return f"Player:{self.player.username}, Winner:{self.is_winner}, Score:{self.tournament_score}"