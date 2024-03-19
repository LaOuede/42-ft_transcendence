from history.models import Game, Score
from user.models import User
from django.core.management.base import BaseCommand
import random

NUM_GENERATED_GAMES = 10




class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self.clear_games_data()
        for _ in range(1, NUM_GENERATED_GAMES):
            scores = self.mock_normal_game()
            # Random winner
            winner = random.choice(scores)
            winner.is_winner = True
            print("Scores created: ", scores)
            # TODO: mock tournament games too

    def clear_games_data(self):
        print("Deleting games data ...")
        for game in Game.objects.all():
            game.delete()

    def mock_normal_game(self):
        all_users = list(User.objects.all())
        
        new_game = Game.objects.create()
        playerNumber = random.randint(2, 4)
        random_players = random.sample(all_users, playerNumber)
        scores = [
            Score.objects.create(player=player, game=new_game)
            for player in random_players
        ]
        return scores

    def mock_tournament_game(self):
        # TODO: gen and attribute random tournament scores
        pass

