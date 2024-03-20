from django.urls import path
from . import views

urlpatterns = [
	path("", views.FriendsList, name="friends-list")
]