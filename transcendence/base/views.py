from django.shortcuts import render
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, api_view

@authentication_classes([JWTAuthentication])
def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def index(request):
	if is_ajax(request):
		return render(request, "index.html")
	else:
		if not request.user.is_authenticated:
			content = "login.html"
		else:
			content = "index.html"
		return render(request, "base.html", {"content": content})
