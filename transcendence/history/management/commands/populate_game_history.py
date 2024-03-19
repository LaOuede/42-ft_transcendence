from games_history.models import Game
from user.models import User
from django.core.management.base import BaseCommand
from random import sample


class PopulateGame(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        all_users = list(User.objects.all())
        players = sample(all_users, 4)
        print(players)
        

