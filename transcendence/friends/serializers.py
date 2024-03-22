from rest_framework import serializers
from .models import FriendRequest
from django.conf import settings

class AddFriendSerializer(serializers.ModelSerializer):
    from_user = serializers.PrimaryKeyRelatedField(
        read_only=False, queryset=settings.AUTH_USER_MODEL
    )
    to_user_id = serializers.PrimaryKeyRelatedField(
        read_only=False, queryset=settings.AUTH_USER_MODEL
    )
    class Meta():
        model = FriendRequest
        fields = ("__all__",)