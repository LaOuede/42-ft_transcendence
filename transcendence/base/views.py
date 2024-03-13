from django.shortcuts import render


def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"

def index(request):
	if is_ajax(request):
		return render(request, "index.html")
	else:
		if not request.user.is_authenticated:
			content = "login.html"
		else:
			content = "index.html"
		return render(request, "base.html", {"content": content})
