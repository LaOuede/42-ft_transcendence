from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from user.views import UserProfile, UserDelete, UserToggle2FA, UserUpdate, UserSettings

urlpatterns = [
	path('delete/', UserDelete, name='user-delete'),
	path('profile/', UserProfile, name='user-profile'),
	path('settings/', UserSettings, name='settings'),
	path('toggle-2fa/', UserToggle2FA, name='user-toggle-2fa'),
	path('update/', UserUpdate, name='update-user-profile'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)