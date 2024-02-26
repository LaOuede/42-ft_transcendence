from django.shortcuts import render

# Create your views here.


def is_ajax(request):
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"


def pong(request):
    # Serve pong content for AJAX, full SPA for direct access
    if is_ajax(request):
        return render(request, "pong.html")
    return render(request, "base.html", {"content": "pong.html"})
