from user.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from custom_auth.views import get_user_from_token

def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"

def get_activity_display(self):
	for code, label in activity_enum:
		if code == self.activity:
			return label
	return 'Unknown'

def get_language_display(self):
	for code, label in language_enum:
		if code == self.language:
			return label
	return 'Unknown'

def update_user_status_after_game(user, status):
	if user.activity == 'IG':
		user.activity = status
		user.save()
	print("User activity: " + user.activity)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
def UserProfile(request):
	if is_ajax(request):
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		update_user_status_after_game(user, "ON")
		activity_display = user.get_activity_display()
		language_display = user.get_language_display()
		serializer = UserSerializer(user)
		user_data = serializer.data
		user_data['activity'] = activity_display
		user_data['language'] = language_display
		return render(request, 'profile.html', {'user_data': user_data})
	return render(request, "base.html", {"content": "login.html"})

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def UserSettings(request):
	if is_ajax(request):
		return render(request, 'settings.html', {"content": "settings.html"})
	return render(request, "base.html", {"content": "login.html"})

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def UserUpdate(request):
	user = get_user_from_token(request)
	if user is None:
		return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
	serializer = UserSerializer(user, data=request.data, partial=True)
	if serializer.is_valid():
		serializer.save()
		return Response({"user": serializer.data}, status=status.HTTP_200_OK)
	return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def UserDelete(request):
	print("request: ", request.method)
	if request.method == "POST":
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		user.delete()
		return JsonResponse({"success": "Account suppressed successfully"}, status=200)
	else:
		return JsonResponse({"error": "Invalid request"}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def UserToggle2FA(request):
	if request.method == "POST":
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		if (user.twoFA):
			user.twoFA = False
		elif (not user.twoFA):
			user.twoFA = True
		user.save()
		return JsonResponse({"success": "2FA enabled", "twoFA": user.twoFA}, status=200)
	return JsonResponse({"error": "Invalid request"}, status=400)
