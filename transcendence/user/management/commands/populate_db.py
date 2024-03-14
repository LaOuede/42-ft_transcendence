from user.models import User
from django.core.management.base import BaseCommand

class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"

USERS = [
    {"username": "Alex", "email": "alex@example.com", "password": "pass"},
    {"username": "Bob", "email": "bob@example.com", "password": "pass"},
    {"username": "Chet", "email": "chet@example.com", "password": "pass"},
    {"username": "Dave", "email": "dave@example.com", "password": "pass"},
    {"username": "Edward", "email": "edward@example.com", "password": "pass"},
    {"username": "Frank", "email": "frank@example.com", "password": "pass"},
]


class Command(BaseCommand):
    help = "Custom populate user database"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self.add_users()

    def is_populated(self):
        print(f"{Color.BOLD}Checking if the database is populated...{Color.RESET}")
        return User.objects.exists()

    def add_users(self):
        if self.is_populated():
            print(f"{Color.YELLOW}[WARNING]{Color.RESET} Database is already populated.")
            return
        for user_info in USERS:
            user = User.objects.create_user(
                username=user_info["username"],
                email=user_info["email"],
                password=user_info["password"],
            )
            user.save()
            print(f"User {user.username} created successfully.")
