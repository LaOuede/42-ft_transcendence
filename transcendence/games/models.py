from django.db import models
from user.models import User

class Game(models.Model):
    player1 = models.ForeignKey(User, related_name='games_p1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(User, related_name='games_p2', on_delete=models.CASCADE)
    player1_score = models.PositiveIntegerField(null=True, blank=True)
    player2_score = models.PositiveIntegerField(null=True, blank=True)
    winner = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username}"