from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

class Profile(AbstractBaseUser, PermissionsMixin):

    ONLINE = 'ON'
    IN_GAME = 'IG'
    OFFLINE = 'OF'
    UNAVAILABLE = 'UN'

    ACTIVITY_CHOICES = [
        (ONLINE, 'En ligne'),
        (IN_GAME, 'En partie'),
        (OFFLINE, 'Hors ligne'),
        (UNAVAILABLE, 'Indisponible')
    ]

    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100, default='pass')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True) #blank=True need to be removed because an avatar is always required
    activity = models.CharField(max_length=2, choices=ACTIVITY_CHOICES, default=OFFLINE)

    # Fields that we may need :
    #nickname = models.CharField(max_length=30, unique=True)
    #isadmin = models.BooleanField(default=False)
    #twoFA = models.BooleanField(default=False)


    # en ce moment les users ont tous les accès. à revoir - Relier à PermissionsMixin
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='user_profiles',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='user_profiles',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password', 'email']
