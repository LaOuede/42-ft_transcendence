import random
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

VALID_AVATARS = [
	'avatars/Blaireau.jpg',
	'avatars/Chevreuil.jpg',
	'avatars/Corbeau.jpg',
	'avatars/Ecureuil.jpg',
	'avatars/Grenouille.jpg',
	'avatars/Hiboux.jpg',
	'avatars/Loup.jpg',
	'avatars/Lynx.jpg',
	'avatars/Oiseau.jpg',
	'avatars/Oiseau2.jpg',
	'avatars/Orignal.jpg',
	'avatars/Ours.jpg',
	'avatars/Ourson.jpg',
	'avatars/Raton-Laveur.jpg',
	'avatars/Renard.jpg',
	'avatars/Renard2.jpg'
]

class UserManager(BaseUserManager):
	def create_user(self, email, username, password=None, **extra_fields):
		if not email:
			raise ValueError(_('The Email field must be set'))
		email = self.normalize_email(email)
		user = self.model(email=email, username=username, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('avatar', 'avatars/default_avatar.jpg')

		return self.create_user(email, username, password, **extra_fields)
	def get_by_natural_key(self, username):
		return self.get(username=username)

class User(AbstractBaseUser, PermissionsMixin):

	objects = UserManager()

	def natural_key(self):
		return (self.username,)

	activity_enum = [
		('ON', 'Online 🟢'),
		('IG', 'In game 🟣'),
		('OF', 'Offline 🔴'),
		('UN', 'Unavailable 🟡'),
	]

	language_enum = [
		('en', '🇬🇧'),
		('fr', '🇫🇷'),
		('es', '🇪🇸'),
	]

	def random_avatar_path():
		return random.choice(VALID_AVATARS)

	username = models.CharField(max_length=30, unique=True)
	email = models.EmailField(max_length=100)
	password = models.CharField(max_length=100, default='pass')
	activity = models.CharField(max_length=2, choices=activity_enum, default='OF')
	avatar = models.ImageField(upload_to='avatars/', default=random_avatar_path, blank=True, null=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	otp = models.CharField(max_length=6, blank=True, null=True)
	otp_expiry_time = models.DateTimeField(blank=True, null=True)
	is_oauth = models.BooleanField(default=False)
	twoFA = models.BooleanField(default=False)
	language = models.CharField(max_length=2, choices=language_enum, default='en')
	current_language = models.CharField(max_length=2, choices=language_enum, default='en')

	# en ce moment les users ont tous les accès. à revoir - Relier à PermissionsMixin
	groups = models.ManyToManyField(
		'auth.Group',
		related_name='user_groups',
		blank=True,
		help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
		verbose_name='groups',
	)
	user_permissions = models.ManyToManyField(
		'auth.Permission',
		related_name='user_permissions',
		blank=True,
		help_text='Specific permissions for this user.',
		verbose_name='user permissions',
	)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['password', 'email']

	def __str__(self):
		return self.username + ' User'