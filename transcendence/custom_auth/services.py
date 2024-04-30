import random, string, uuid, jwt, os, requests
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.utils.http import http_date
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User
from .models import OTPSession

from friends.utils import broadcast_status_update

def verify_otp_service(session_token, otp):
    otp_session = OTPSession.objects.filter(session_token=session_token).first()
    if not otp_session:
        return None, "Invalid session or session expired."

    user = otp_session.user
    if user.otp_expiry_time <= timezone.now():
        return None, "OTP expired."
    elif user.otp != otp:
        return None, "Invalid OTP."

    otp_session.delete()
    return user, "Success"


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
    max_age_refresh = 24 * 3600 * 14
    expires_refresh = http_date(datetime.now().timestamp() + max_age_refresh)
    response.set_cookie(
        'refresh_token',
        tokens['refresh'],
        max_age=max_age_refresh,
        expires=expires_refresh,
        httponly=True,
        secure=True,
        samesite=None
    )

    return response

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
        user.activity = status
        user.save()
        broadcast_status_update(user, status)
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


def get_auth_url():
    OAUTH_CLIENT_ID = os.getenv('OAUTH_CLIENT_ID')
    OAUTH_REDIRECT_URI = os.getenv('OAUTH_REDIRECT_URI')
    if not OAUTH_CLIENT_ID or not OAUTH_REDIRECT_URI:
        return None, "Missing OAUTH_CLIENT_ID or OAUTH_REDIRECT_URI in environment variables"

    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={OAUTH_CLIENT_ID}&redirect_uri={OAUTH_REDIRECT_URI}&response_type=code"
    return auth_url, None

def exchange_code_for_token(code):
    OAUTH_CLIENT_ID = os.getenv('OAUTH_CLIENT_ID')
    OAUTH_SECRET_KEY = os.getenv('OAUTH_SECRET_KEY')
    OAUTH_REDIRECT_URI = os.getenv('OAUTH_REDIRECT_URI')

    token_url = 'https://api.intra.42.fr/oauth/token'
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': OAUTH_CLIENT_ID,
        'client_secret': OAUTH_SECRET_KEY,
        'code': code,
        'redirect_uri': OAUTH_REDIRECT_URI,
    }
    response = requests.post(token_url, data=token_data)
    return response.json()

def get_user_info(access_token):
    user_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(user_url, headers=headers)
    return response.json()

def handle_user_oauth(user_data):
    user = User.objects.filter(username=user_data.get('login'), is_oauth=True).first()
    if user is None:
        user = User(username=user_data.get('login'), email=user_data.get('email'), is_oauth=True)
        user.set_unusable_password()
        image_url = user_data.get('image', {}).get('link')
        if image_url:
            response = requests.get(image_url)
            if response.status_code == 200:
                user.avatar.save(f"avatar_{user.username}.jpg", ContentFile(response.content))
        user.save()

    change_user_status(user, "ON")
    tokens = get_tokens_for_user(user)
    return user, tokens
