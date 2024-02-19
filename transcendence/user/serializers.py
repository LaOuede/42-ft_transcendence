from rest_framework import serializers
from django.core.validators import RegexValidator, EmailValidator
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'password', 'activity']
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
        if Profile.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if Profile.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

# For API purpose :
# {
#     "username": "testuser",
#     "password": "testpassword",
#     "email": "test@example.com"
# }