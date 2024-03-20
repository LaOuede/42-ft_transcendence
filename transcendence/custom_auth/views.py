from datetime import datetime
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from datetime import timedelta
from django.core.files.base import ContentFile
from django.core.files.temp import NamedTemporaryFile
import requests, os
from urllib.parse import urlencode
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect
from django.utils.http import http_date
import random, string, uuid, time, jwt, json
from user.models import User
from .models import OTPSession

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken



# Create your views here.

def is_ajax(request):
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"

@api_view(['GET'])
def check_session(request):
    if request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    else:
        return JsonResponse({"isAuthenticated": False}, status=401)

def generate_random_otp(n=6):
    return "".join(random.choices(string.digits, k=n))

def generate_session_token():
    return str(uuid.uuid4())

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
    if decoded_payload is not None:
        user = User.objects.filter(id=decoded_payload.get('user_id')).first()# Check if decoded_payload is not None
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

def sendingEmail(otp, user):
    sent = send_mail(
        'Transcendence - Verification code',
        f'Your verification code is {otp}',
        'from@example.com',
        [user.email],
        fail_silently=False,
    )
    if (sent == 0):
        return False
    return True

def generate_otp_user(user): 
    otp = generate_random_otp()
    user.otp = otp
    user.otp_expiry_time = timezone.now() + timedelta(minutes=10)
    user.save()
    
    session_token = generate_session_token()
    # Store the session token and user association
    OTPSession.objects.create(user=user, session_token=session_token)
    if (sendingEmail(otp, user) == False):
        return False
    return session_token

def setCookies(response, tokens):
    # Set the access token as a cookie in the response
    max_age_access = 3600  # Example: Access token expiry (in seconds)
    expires_access = http_date(datetime.now().timestamp() + max_age_access)
    response.set_cookie(
        'access_token',
        tokens['access'],
        max_age=max_age_access,
        expires=expires_access,
        httponly=True,
        secure=True,  # Recommend using secure cookies in production
        samesite=None
    )

    # Set the refresh token as a cookie in the response, if you have a refresh token
    max_age_refresh = 24 * 3600 * 14  # Example: Refresh token expiry (in seconds, e.g., 14 days)
    expires_refresh = http_date(datetime.now().timestamp() + max_age_refresh)
    response.set_cookie(
        'refresh_token',
        tokens['refresh'],
        max_age=max_age_refresh,
        expires=expires_refresh,
        httponly=True,
        secure=True,  # Recommend using secure cookies in production
        samesite=None
    )

    return response

def login(request):
    if request.method == "POST":
        time.sleep(2)
        data = json.loads(request.body)
        user = data.get("user")
        password = data.get("password")

        user = authenticate(username=user, password=password)
        if user is not None:
            if (user and user.twoFA == False):
                change_user_status(user, "ON")
                tokens = get_tokens_for_user(user)
                response = JsonResponse({"success": "User logged in successfully"})
                return setCookies(response, tokens)
                
            session_token = generate_otp_user(user)   
            if (session_token != False):
                return JsonResponse(
                    { "session_token": session_token, "success": "OTP Validation."}, status=200
                )
            else:
                return JsonResponse(
                    {
                        "error": "Error sending email.",
                    },
                    status=401,
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

def verify_otp(request):
    time.sleep(2)
    if request.method == "POST":
        data = json.loads(request.body)
        otp = data.get("otp")
        session_token = data.get("session_token")

        # Retrieve the OTP session
        otp_session = OTPSession.objects.filter(session_token=session_token).first()

        if otp_session:
            user = otp_session.user
            if user.otp_expiry_time <= timezone.now():  # Check for expiry first
                return JsonResponse({"error": "OTP expired."}, status=401)
            elif user.otp != otp:  # Then check for correctness
                return JsonResponse({"error": "Invalid OTP."}, status=401)
            else:
                tokens = get_tokens_for_user(user)
                response = JsonResponse({"success": "User logged in successfully"})
                otp_session.delete()
                change_user_status(user, "ON")
                return setCookies(response, tokens)
        else:
            return JsonResponse({"error": "Invalid session or session expired."}, status=401)

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
            user.save()
            if user:
                change_user_status(user, "ON")
                tokens = get_tokens_for_user(user)
                response = JsonResponse({"success": "User registered successfully"})
                return setCookies(response, tokens)

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

def otp_view(request):
    if is_ajax(request):
        return render(request, "otp.html")
    return render(request, "base.html", {"content": "login.html"})

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def logout(request):
    user = request.user
    print(user)
    if user:
        change_user_status(user, "OF")
        response = JsonResponse({"success": "Logged out successfully"}, status=200)
        response.delete_cookie('access_token')  # Optional: Clear the authentication cookie
        response.delete_cookie('refresh_token')  # Optional: Clear the refresh token if you use one
        return response
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)

def start_auth(request):
    OAUTH_CLIENT_ID = os.getenv('OAUTH_CLIENT_ID')
    OAUTH_REDIRECT_URI = os.getenv('OAUTH_REDIRECT_URI')

    if (OAUTH_CLIENT_ID is None or OAUTH_REDIRECT_URI is None):
        return JsonResponse({"error": "Missing OAUTH_CLIENT_ID or OAUTH_REDIRECT_URI in environment variables"}, status=500)
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={OAUTH_CLIENT_ID}&redirect_uri={OAUTH_REDIRECT_URI}&response_type=code"
    return JsonResponse({"url": auth_url}, status=200)

def callback(request):
    code = request.GET.get('code')
    
    OAUTH_CLIENT_ID = os.getenv('OAUTH_CLIENT_ID')
    OAUTH_SECRET_KEY = os.getenv('OAUTH_SECRET_KEY')
    OAUTH_REDIRECT_URI = os.getenv('OAUTH_REDIRECT_URI')
    # Exchange the code for a token
    token_url = 'https://api.intra.42.fr/oauth/token'
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_SECRET_KEY,
        'code': code,
        'redirect_uri': OAUTH_REDIRECT_URI,
    }
    token_r = requests.post(token_url, data=token_data)
    token_json = token_r.json()
    
    if 'error' in token_json:
        return JsonResponse({'error': token_json.get('error_description', 'Unknown error')}, status=400)

    # Use the token to access user's information as an example
    user_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {token_json["access_token"]}'}
    user_r = requests.get(user_url, headers=headers)
    user_json = user_r.json()

    return handleOAuthLogin(user_json)

def handleOAuthLogin(user_data):
    user = User.objects.filter(username=user_data.get('login'), is_oauth=True).first()
    if user is None:
        # Create a new user
        user = User.objects.create_user(username=user_data.get('login'), email=user_data.get('email'))
        user.is_oauth = True
        user.password = "42OAuth"
        # Download the user's image from the OAuth provider
        image_url = user_data.get('image', {}).get('link')
        if image_url:
            response = requests.get(image_url)
            if response.status_code == 200:
                user.avatar.save(f"avatar_{user.username}.jpg", ContentFile(response.content))
        user.save()
        
    change_user_status(user, "ON")
    tokens = get_tokens_for_user(user)
    response = HttpResponseRedirect('/')
    return setCookies(response, tokens)
    