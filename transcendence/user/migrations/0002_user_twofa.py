# Generated by Django 3.2.25 on 2024-03-13 00:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='twoFA',
            field=models.BooleanField(default=False),
        ),
    ]
