# user/signals.py
from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import User

@receiver(post_migrate, sender=AppConfig)
def populate_database(sender, **kwargs):
    if not User.objects.exists():
        # Populate the database with initial data
        User.objects.create_user(username='Alex', email='alex@example.com', password='pass')
        # Add more initial data as needed
