from django.urls import path
from .views import FriendRequestView, FriendsListView, index
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path("", index),
	path("list/", FriendsListView, name="friends-list"),
    path("add/", FriendRequestView.as_view(), name="add-friend-request"),
]