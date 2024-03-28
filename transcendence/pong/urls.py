from django.urls import path
from pong.views import pong, play, onevsone, rumble, playonevsone, playrumble, tournaments, playtournaments, rules

urlpatterns = [
	path("play/", play, name="play"),
	path("onevsone/", onevsone, name="onevsone"),
	path("rumble/", rumble, name="rumble"),
	path("playonevsone/", playonevsone, name="playonevsone"),
	path("playrumble/", playrumble, name="playrumble"),
	path("tournaments/", tournaments, name="tournaments"),
	path("playtournaments/", playtournaments, name="playtournaments"),
	path("rules/", rules, name="rules"),
]