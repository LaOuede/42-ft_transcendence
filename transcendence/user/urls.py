from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from user.views import UserProfile, UserDelete, UserToggle2FA, update_profile

urlpatterns = [
	path('profile/', UserProfile, name='user-profile'),
	path('update/', update_profile, name='update-user-profile'),
	path('delete/', UserDelete, name='user-delete'),
	path('toggle-2fa/', UserToggle2FA, name='user-toggle-2fa'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)