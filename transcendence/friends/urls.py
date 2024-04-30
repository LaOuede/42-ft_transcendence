from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
	path("list/", views.FriendsListView, name="friends-list"),
    path("request/", views.FriendRequestView.as_view(), name="add-friend-request"),
]