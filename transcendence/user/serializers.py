from rest_framework import serializers
from django.core.validators import RegexValidator, EmailValidator
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'username': {'required': True, 'validators': [RegexValidator(regex='^[a-zA-Z0-9_]+$', message='Username must contain only letters, numbers, and underscores')]},
            'email': {'required': True, 'validators': [EmailValidator(message='Enter a valid email address')]},
            'password': {'required': True},
        }
