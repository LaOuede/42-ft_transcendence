from django.urls import path
from custom_auth.views import login, register, logout, otp_view, verify_otp

from rest_framework_simplejwt.views import (
	TokenObtainPairView,
	TokenRefreshView,
)

urlpatterns = [
	path("login/", login, name="login"),
	path("logout/", logout, name="logout"),
	path("otp/", otp_view, name="otp"),
	path("register/", register, name="create_profile"),
	path("verify-otp/", verify_otp, name="verify_otp"),

	path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
	path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
