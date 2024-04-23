from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from base.views import index
from django.http import HttpResponse

def favicon(request):
    return HttpResponse(status=204)

urlpatterns = [
	path("", index, name="index"),
 	path('favicon.ico', favicon),
	path("pong/", include("pong.urls")),
	path("user/", include("user.urls")),
	path("game/", include("games_history.urls")),
	path("auth/", include("custom_auth.urls")),
	path("friends/", include("friends.urls")),
	path("admin/", admin.site.urls, name="admin"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
