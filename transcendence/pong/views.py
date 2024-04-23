from django.shortcuts import render
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, authentication_classes
from custom_auth.services import change_user_status
from custom_auth.views import get_user_from_token
from user.serializers import UserSerializer
from user.views import update_user_status_after_game


def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def pong(request):
	# Serve pong content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "pong.html")
	return render(request, "base.html", {"content": "pong.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def play(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		update_user_status_after_game(user, "ON")
		return render(request, "play.html")
	return render(request, "base.html", {"content": "play.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def onevsone(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "onevsone.html")
	return render(request, "base.html", {"content": "onevsone.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def rumble(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "rumble.html")
	return render(request, "base.html", {"content": "rumble.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def playonevsone(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):

		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		change_user_status(user, "IG")
		serializer = UserSerializer(user)
		user_data = serializer.data

		return render(request, "playonevsone.html", {'user_data': user_data})
	return render(request, "base.html", {"content": "playonevsone.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def playrumble(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		change_user_status(user, "IG")
		serializer = UserSerializer(user)
		user_data = serializer.data
		return render(request, "playrumble.html", {'user_data': user_data})
	return render(request, "base.html", {"content": "playrumble.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def tournaments(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		update_user_status_after_game(user, "ON")
		return render(request, "tournaments.html")
	return render(request, "base.html", {"content": "tournaments.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def playtournaments(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		change_user_status(user, "IG")
		serializer = UserSerializer(user)
		user_data = serializer.data
		return render(request, "playtournaments.html", {'user_data': user_data})
	return render(request, "base.html", {"content": "playtournaments.html"})

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def rules(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		update_user_status_after_game(user, "ON")
		return render(request, "rules.html")
	return render(request, "base.html", {"content": "rules.html"})