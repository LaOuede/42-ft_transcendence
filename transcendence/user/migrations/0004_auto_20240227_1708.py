# Generated by Django 3.2.24 on 2024-02-27 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_delete_customuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
    ]
