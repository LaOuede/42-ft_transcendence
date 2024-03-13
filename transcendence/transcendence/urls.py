"""
URL configuration for transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from django.contrib import admin
from custom_auth import views as custom_auth_views
from base import views as base_views
from custom_auth.views import login, register, logout, otp_view
from games_history.views import CreateGame, GameGetOne, GameGetAll, GameDelete, GameUpdate
from pong.views import pong


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", custom_auth_views.login, name="login"),
    path("register/", custom_auth_views.register, name="create_profile"),
    path("logout/", custom_auth_views.logout, name="logout"),
    path("otp/", custom_auth_views.otp_view, name="otp"),
    path("verify-otp/", custom_auth_views.verify_otp, name="verify_otp"),
    path("admin/", admin.site.urls, name="admin"),
    path("user/", include("user.urls")),
    path("pong/", include("pong.urls")),
    path("", base_views.index, name="index"),
    path("play/create/", CreateGame.as_view(), name="game-create"),
    path("play/<int:game_id>/", GameGetOne.as_view(), name="game-detail"),
    path("play/games/", GameGetAll.as_view(), name="games-all"),
    path("play/<int:game_id>/delete/", GameDelete.as_view(), name="game-delete"),
    path("play/<int:game_id>/update/", GameUpdate.as_view(), name="game-update"),
]
