from django.shortcuts import render


def is_ajax(request):
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"

def index(request):
    if is_ajax(request):
        return render(request, "play.html")
    else:
        if not request.user.is_authenticated:
            content = "login.html"
        else:
            content = "play.html"
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
