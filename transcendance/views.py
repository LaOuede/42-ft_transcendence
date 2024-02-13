from django.http import HttpResponse
from django.shortcuts import render

def is_ajax(request):
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest'

## AUTH

def signup(request):
    if is_ajax(request):
        return (render(request, "signup.html", {}))
    else:
        return render(request, "base.html")
    


def index(request):
    if is_ajax(request):
        return render(request, 'index.html')
    return render(request, 'base.html')

def play(request):
    if is_ajax(request):
        return render(request, 'play.html')
    return render(request, 'base.html')

def tournaments(request):
    if is_ajax(request):
        return render(request, 'tournaments.html')
    return render(request, 'base.html')


