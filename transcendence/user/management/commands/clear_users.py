from user.models import User
from django.core.management.base import BaseCommand

class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"

class Command(BaseCommand):
    help = "Delete users from database"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self.add_users()

    def is_populated(self):
        print(f"{Color.BOLD}Checking if the database is populated...{Color.RESET}")
        return User.objects.exists()

    def add_users(self):
        for user in User.objects.all():
            user.delete()
            print(f"User {user.username} deleted successfully.")
