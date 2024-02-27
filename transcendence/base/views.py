from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from user.models import User
import json

## REST
from rest_framework.decorators import api_view, authentication_classes

## JWT
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"


def get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	return {
		"refresh": str(refresh),
		"access": str(refresh.access_token),
	}


def find_user(username, password):
	users = User.objects.all()

	for user in users:
		print({user})
		if user.username == username and user.password == password:
			return user
	return False


def login(request):
	if request.method == "POST":
		data = json.loads(request.body)
		user = data.get("user")
		password = data.get("password")

		# user = authenticate(username=user, password=password)
		user = find_user(user, password)
		print(f'User found? {user}')
		if user is not None or False:
			tokens = get_tokens_for_user(user)
			return JsonResponse(
				{"tokens": tokens, "success": "User logged in successfully"}, status=201
			)
		else:
			return JsonResponse(
				{
					"error": "Invalid user or password.",
				},
				status=401,
			)
	if is_ajax(request):
		return render(request, "login.html")
	return render(request, "base.html", {"content": "login.html"})


def register(request):
	if request.method == "POST":
		data = json.loads(request.body)
		username = data.get("username")
		password = data.get("password")
		password2 = data.get("password2")
		email = data.get("email")

		if User.objects.filter(username=username).exists():
			return JsonResponse({"error": "Username is already taken."}, status=400)

		if User.objects.filter(email=email).exists():
			return JsonResponse({"error": "Email is already in use."}, status=400)

		if password != password2:
			return JsonResponse({"error": "Passwords do not match."}, status=400)

		if username and password and email:
			user = User.objects.create_user(username, email, password)
			user.save()
			if user:
				tokens = get_tokens_for_user(user)
			return JsonResponse(
				{"success": "User registered successfully", "tokens": tokens},
				status=201,
			)
		else:
			return JsonResponse(
				{
					"error": "Invalid user or password.",
				},
				status=400,
			)
	if is_ajax(request):
		return render(request, "register.html")
	return render(request, "base.html", {"content": "register.html"})


@authentication_classes([JWTAuthentication])
def logout(request):
	print("here")
	if request.method == "POST":
		return JsonResponse({"success": "Logged out successfully"}, status=200)
	else:
		return JsonResponse({"error": "Invalid request"}, status=400)


def index(request):
	if is_ajax(request):
		return render(request, "index.html")
	else:
		if not request.user.is_authenticated:
			content = "login.html"
		else:
			content = "index.html"
		return render(request, "base.html", {"content": content})


def play(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "play.html")
	return render(request, "base.html", {"content": "play.html"})


def tournaments(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "tournaments.html")
	return render(request, "base.html", {"content": "tournaments.html"})
