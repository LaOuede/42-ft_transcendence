from rest_framework import serializers
from django.core.validators import RegexValidator, EmailValidator
from django.core.files.storage import default_storage
from .models import User, VALID_AVATARS
from django.utils.translation import gettext_lazy as _
from friends.utils import broadcast_refresh



class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'email', 'activity', 'language', 'current_language','avatar', 'twoFA', 'is_active']
		extra_kwargs = {
			'username': {
				'required': True,
				'validators': [
					RegexValidator(
						regex='^[a-zA-Z0-9_]+$',
						message=_('Username must contain only letters, numbers, and underscores')
					)
				],
			},
			'email': {'required': True,},
			'password': {'required': True},
		}

	def validate_username(self, value):
		if User.objects.filter(username=value).exists():
			raise serializers.ValidationError(_("Username already exists."))
		return value

	def validate_email(self, value):
		if User.objects.filter(email=value).exists():
			raise serializers.ValidationError(_("Email already exists."))
		return value

	def update(self, instance, validated_data):
		if 'avatar' in validated_data:
			if instance.avatar:
				avatar_path = instance.avatar.path
				if not any(avatar_path.endswith(valid_avatar) for valid_avatar in VALID_AVATARS):
					if default_storage.exists(avatar_path):
						default_storage.delete(avatar_path)
			instance.avatar = validated_data.get('avatar', instance.avatar)

		instance.username = validated_data.get('username', instance.username)
		instance.email = validated_data.get('email', instance.email)
		instance.activity = validated_data.get('activity', instance.activity)
		instance.language = validated_data.get('language', instance.language)
		instance.current_language = validated_data.get('current_language', instance.current_language)
		broadcast_refresh()

		instance.save()
		return instance
