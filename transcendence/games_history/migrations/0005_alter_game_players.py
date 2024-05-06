# Generated by Django 3.2.25 on 2024-05-06 16:31

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('games_history', '0004_auto_20240506_1516'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='players',
            field=models.ManyToManyField(related_name='played_games', through='games_history.GamePlayer', to=settings.AUTH_USER_MODEL),
        ),
    ]
