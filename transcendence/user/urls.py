from django.urls import path
from user.views import UserProfile, UserDelete, UserToggle2FA

urlpatterns = [
	path('profile/', UserProfile, name='user-profile'),
	path('delete/', UserDelete, name='user-delete'),
	path('toggle-2fa/', UserToggle2FA, name='user-toggle-2fa'),
]