from django.urls import path
from user.views import UserProfile, UserDelete	

urlpatterns = [
	path('profile/', UserProfile, name='user-profile'),
	path('delete/', UserDelete, name='user-delete'),
]