from django.urls import path
from .views import FriendRequest, FriendsListView

urlpatterns = [
	path("", FriendsListView, name="friends-list"),
    path("request/", FriendRequest.as_view(), name="friends-request")
]