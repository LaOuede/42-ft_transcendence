from django.db import models
#from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin //for authentification ?

#class User(AbstractBaseUser, PermissionsMixin):
class Profile(models.Model):

    ONLINE = 'ON'
    IN_GAME = 'IG'
    OFFLINE = 'OF'
    UNAVAILABLE = 'UN'

    STATUS_CHOICES = [
        (ONLINE, 'En ligne'),
        (IN_GAME, 'En partie'),
        (OFFLINE, 'Hors ligne'),
        (UNAVAILABLE, 'Indisponible')
    ]

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    #nickname = models.CharField(max_length=30)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=50, default='changeYourPasswordASAP')
    avatar = models.CharField(max_length=255, blank=True) #blank=True need to be removed
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=OFFLINE)
    twoFA = models.BooleanField(default=False)
