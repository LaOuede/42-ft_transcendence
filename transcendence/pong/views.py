from django.shortcuts import render

# Create your views here.


def is_ajax(request):
	return request.headers.get("X-Requested-With") == "XMLHttpRequest"


def pong(request):
	# Serve pong content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "pong.html")
	return render(request, "base.html", {"content": "pong.html"})

def play(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "play.html")
	return render(request, "base.html", {"content": "play.html"})

def onevsone(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "onevsone.html")
	return render(request, "base.html", {"content": "onevsone.html"})

def rumble(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "rumble.html")
	return render(request, "base.html", {"content": "rumble.html"})

def playonevsone(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "playonevsone.html")
	return render(request, "base.html", {"content": "playonevsone.html"})

def playrumble(request):
	# Serve play content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "playrumble.html")
	return render(request, "base.html", {"content": "playrumble.html"})

def tournaments(request):
	# Serve tournaments content for AJAX, full SPA for direct access
	if is_ajax(request):
		return render(request, "tournaments.html")
	return render(request, "base.html", {"content": "tournaments.html"})