from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from user.models import User
from django.contrib.auth import authenticate
import json

import jwt
from rest_framework_simplejwt.settings import api_settings

## REST
from rest_framework.decorators import api_view, authentication_classes

## JWT
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.

def is_ajax(request):
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

def find_user_by_id(id):
    users = User.objects.all()
    for user in users:
        if user.id == id:
            return user
    return False

def find_user(username, password):
    users = User.objects.all()
    for user in users:
        if user.username == username and user.password == password:
            return user
    return False
    
def get_user_from_token(request):
    token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
    decoded_payload = decode_jwt(token)
    if decoded_payload is not None:  # Check if decoded_payload is not None
        user = find_user_by_id(decoded_payload.get('user_id'))  # Use .get() to avoid KeyError
        if user:
            return user
    return None

def change_user_status(user, status):
    if user is not None and user.activity != status:
        user.activity = status  # Corrected this line
        user.save()
        return True
    else:
        return False
    
def decode_jwt(token):
    try:
        decoded = jwt.decode(token, api_settings.SIGNING_KEY, algorithms=[api_settings.ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        print("Token expired. Get a new one.")
    except jwt.InvalidTokenError:
        print("Invalid token. Please log in again.")
    return None

def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = data.get("user")
        password = data.get("password")

        user = authenticate(username=user, password=password)
        if user is not False:
            change_user_status(user, "ON")
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
            user = User.objects.create_user(email, username, password)
            user.avatar = 'static/avatars/default_avatar.jpg'
            user.save()
            if user:
                change_user_status(user, "ON")
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
    if request.method == "POST":
        user = get_user_from_token(request)
        if user is None:
            return JsonResponse({"error": "Invalid token"}, status=401)
        if change_user_status(user, "OF") == False:
            return JsonResponse({"error": "You are already logged out."}, status=500)
        return JsonResponse({"success": "Logged out successfully"}, status=200)
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)
