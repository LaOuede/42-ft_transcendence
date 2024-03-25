from django.urls import path
from .views import FriendRequestView, FriendsListView
from django.contrib.auth.decorators import login_required

urlpatterns = [
	path("", FriendsListView, name="friends-list"),
    path("add/", FriendRequestView.as_view(), name="add-friend-request"),
]