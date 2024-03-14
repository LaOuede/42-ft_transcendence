from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from base.views import index

urlpatterns = [
	path("", index, name="index"),
	path("pong/", include("pong.urls")),
	path("user/", include("user.urls")),
	path("game/", include("games_history.urls")),
	path("auth/", include("custom_auth.urls")),
	path("admin/", admin.site.urls, name="admin"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
