from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

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

		return self.create_user(email, username, password, **extra_fields)
	def get_by_natural_key(self, username):
		return self.get(username=username)

class User(AbstractBaseUser, PermissionsMixin):

	objects = UserManager()
	
	def natural_key(self):
		return (self.username,)
	
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
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)

	# Fields that we may need :
	#nickname = models.CharField(max_length=30, unique=True)
	#isadmin = models.BooleanField(default=False)
	#twoFA = models.BooleanField(default=False)


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
