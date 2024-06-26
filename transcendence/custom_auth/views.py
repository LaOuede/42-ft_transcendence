from datetime import datetime
from django.http import JsonResponse, HttpResponseRedirect

from django.core.files.base import ContentFile
import requests, os
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from django.utils.http import http_date
import time, json
from user.models import User

from .forms import OTPVerificationForm, RegistrationForm, LoginForm
from .services import (
    verify_otp_service,
    setCookies,
    change_user_status,
    get_tokens_for_user,
    generate_otp_user,
    get_user_from_token,
    get_auth_url,
    exchange_code_for_token,
    get_user_info,
    handle_user_oauth,
)

from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken



# Create your views here.

def is_ajax(request):
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"

@api_view(["GET"])
def check_session(request):
    if request.user and request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    else:
        return JsonResponse({"isAuthenticated": False})


@api_view(["GET", "POST"])
def login(request):
    if request.method == "POST":
        time.sleep(2)
        data = json.loads(request.body)
        form = LoginForm(data)

        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
        else:
            errors = {
                field: error.get_json_data() for field, error in form.errors.items()
            }
            return JsonResponse({"errors": errors}, status=400)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user and user.twoFA == False:
                change_user_status(user, "ON")
                tokens = get_tokens_for_user(user)
                response = JsonResponse({
                    "success": "User logged in successfully",
                    "language": user.language
                })
                return setCookies(response, tokens)

            session_token = generate_otp_user(user)
            if session_token != False:
                return JsonResponse(
                    {"session_token": session_token, "success": "OTP Validation."},
                    status=200,
                )
            else:
                return JsonResponse({"error": "Error sending email."}, status=401)
        else:
            return JsonResponse({"error": "Invalid user or password."}, status=401)
    if is_ajax(request):
        if request.user.is_authenticated:
            return render(request, "index.html")
        else:
            return render(request, "login.html")
    return render(request, "base.html", {"content": "login.html"})


@api_view(["GET", "POST"])
def verify_otp(request):
    time.sleep(2)
    if request.method == "POST" and request.user.is_authenticated == False:
        data = json.loads(request.body)
        form = OTPVerificationForm(data)

        if form.is_valid():
            user, message = verify_otp_service(
                form.cleaned_data["session_token"], form.cleaned_data["otp"]
            )

            if user:
                tokens = get_tokens_for_user(user)
                response = JsonResponse({"success": "User logged in successfully"})
                change_user_status(user, "ON")
                return setCookies(response, tokens)
            else:
                return JsonResponse({"error": message}, status=401)
        else:
            return JsonResponse({"error": "Invalid data."}, status=400)
    return render(request, "index.html")


@api_view(["GET", "POST"])
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = RegistrationForm(data)

        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data["username"],
                email=form.cleaned_data["email"],
                password=form.cleaned_data["password"],
            )
            change_user_status(user, "ON")
            tokens = get_tokens_for_user(user)
            response = JsonResponse({"success": "User registered successfully"})
            return setCookies(response, tokens)
        else:
            errors = {
                field: error.get_json_data() for field, error in form.errors.items()
            }
            return JsonResponse({"errors": errors}, status=400)

    if request.is_ajax():
        if request.user.is_authenticated:
            return render(request, "index.html")
        return render(request, "register.html")
    return render(request, "base.html", {"content": "register.html"})


@api_view(["GET"])
def otp_view(request):
    if is_ajax(request):
        if request.user.is_authenticated:
            return render(request, "index.html")
        return render(request, "otp.html")
    return render(request, "base.html", {"content": "login.html"})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def logout(request):
    user = request.user
    if user:
        change_user_status(user, "OF")
        response = JsonResponse({"success": "Logged out successfully"}, status=200)
        response.delete_cookie(
            "access_token"
        )  # Optional: Clear the authentication cookie
        response.delete_cookie(
            "refresh_token"
        )  # Optional: Clear the refresh token if you use one
        return response
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)


def start_auth(request):
    auth_url, error = get_auth_url()
    if error:
        return JsonResponse({"error": error}, status=500)
    return JsonResponse({"url": auth_url}, status=200)


def callback(request):
    code = request.GET.get("code")
    token_json = exchange_code_for_token(code)

    if "error" in token_json:
        return JsonResponse(
            {"error": token_json.get("error_description", "Unknown error")}, status=400
        )

    user_json = get_user_info(token_json["access_token"])
    user, tokens = handle_user_oauth(user_json)
    response = HttpResponseRedirect("/")
    return setCookies(response, tokens)
