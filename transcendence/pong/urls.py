from django.urls import path
from pong.views import pong, play, onevsone, rumble, playonevsone, playrumble, tournaments

urlpatterns = [
	path("play/", play, name="play"),
	path("onevsone/", onevsone, name="onevsone"),
	path("rumble/", rumble, name="rumble"),
	path("playonevsone/", playonevsone, name="playonevsone"),
	path("playrumble/", playrumble, name="playrumble"),
	path("tournaments/", tournaments, name="tournaments"),
]