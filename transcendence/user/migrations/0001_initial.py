# Generated by Django 3.2.24 on 2024-02-14 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserModel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('username', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=100)),
                ('password', models.CharField(max_length=30)),
                ('avatar', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('ON', 'En ligne'), ('IG', 'En partie'), ('OF', 'Hors ligne')], default='OF', max_length=2)),
            ],
        ),
    ]
