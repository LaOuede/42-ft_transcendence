from django.shortcuts import render
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, api_view
from user.views import update_user_status_after_game


@authentication_classes([JWTAuthentication])
def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def index(request):
	if is_ajax(request) and request.user.is_authenticated:
		user = get_user_from_token(request)
		if user is None:
			return JsonResponse({"error": "Invalid token"}, status=401)
		update_user_status_after_game(user, "ON")
		return render(request, "index.html")
	else:
		if request.user.is_authenticated == False:
			return render(request, "base.html", {"content": "login.html"})
		else:
			return render(request, "base.html", {"content": "index.html"})
