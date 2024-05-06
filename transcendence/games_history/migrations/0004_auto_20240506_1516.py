# Generated by Django 3.2.25 on 2024-05-06 15:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('games_history', '0003_auto_20240506_1459'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='players',
            field=models.ManyToManyField(through='games_history.GamePlayer', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='gameplayer',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='games_history.game'),
        ),
        migrations.AlterField(
            model_name='gameplayer',
            name='player',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
