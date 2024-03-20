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
        self.delete_normal_users()

    def is_admin(self, user):
        return user.is_staff

    def delete_normal_users(self):
        for user in User.objects.all():
            if self.is_admin(user):
                continue
            user.delete()
            print(f"User {user.username} deleted successfully.")
