from django.shortcuts import render
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, authentication_classes


# Create your views here.


def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"

@authentication_classes([JWTAuthentication])
def pong(request):
	# Serve pong content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "pong.html")
	return render(request, "base.html", {"content": "pong.html"})

@authentication_classes([JWTAuthentication])
def play(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "play.html")
	return render(request, "base.html", {"content": "play.html"})

@authentication_classes([JWTAuthentication])
def onevsone(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "onevsone.html")
	return render(request, "base.html", {"content": "onevsone.html"})

@authentication_classes([JWTAuthentication])
def rumble(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "rumble.html")
	return render(request, "base.html", {"content": "rumble.html"})

@authentication_classes([JWTAuthentication])
def playonevsone(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "playonevsone.html")
	return render(request, "base.html", {"content": "playonevsone.html"})

@authentication_classes([JWTAuthentication])
def playrumble(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "playrumble.html")
	return render(request, "base.html", {"content": "playrumble.html"})

@authentication_classes([JWTAuthentication])
def tournaments(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "tournaments.html")
	return render(request, "base.html", {"content": "tournaments.html"})

@authentication_classes([JWTAuthentication])
def playtournaments(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "playtournaments.html")
	return render(request, "base.html", {"content": "playtournaments.html"})

@authentication_classes([JWTAuthentication])
def rules(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "rules.html")
	return render(request, "base.html", {"content": "rules.html"})