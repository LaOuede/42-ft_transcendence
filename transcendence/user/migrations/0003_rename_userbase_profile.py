# Generated by Django 3.2.24 on 2024-02-14 18:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_rename_usermodel_userbase'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserBase',
            new_name='Profile',
        ),
    ]
