from rest_framework import serializers
from django.core.validators import RegexValidator, EmailValidator
from django.core.files.storage import default_storage
from .models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'email', 'activity', 'avatar', 'twoFA', 'is_active']
		extra_kwargs = {
			'username': {
				'required': True,
				'validators': [RegexValidator(regex='^[a-zA-Z0-9_]+$', message='Username must contain only letters, numbers, and underscores')],
			},
			'email': {
				'required': True,
				'validators': [EmailValidator(message='Enter a valid email address')],
			},
			'password': {'required': True},
		}

	def validate_username(self, value):
		if User.objects.filter(username=value).exists():
			raise serializers.ValidationError("Username already exists.")
		return value

	def validate_email(self, value):
		if User.objects.filter(email=value).exists():
			raise serializers.ValidationError("Email already exists.")
		return value

	def update(self, instance, validated_data):
		if 'avatar' in validated_data:
			if instance.avatar:
				avatar_path = instance.avatar.path
				if default_storage.exists(avatar_path):
					default_storage.delete(avatar_path)
			instance.avatar = validated_data.get('avatar', instance.avatar)
		instance.username = validated_data.get('username', instance.username)
		instance.email = validated_data.get('email', instance.email)

		instance.save()
		return instance


