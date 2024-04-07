# Generated by Django 3.2.25 on 2024-04-05 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1_score', models.PositiveIntegerField(blank=True, null=True)),
                ('player2_score', models.PositiveIntegerField(blank=True, null=True)),
                ('winner', models.PositiveIntegerField(blank=True, null=True)),
                ('loser', models.PositiveIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
