from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

def play(request):
    return render(request, 'play.html')

def tournaments(request):
    return render(request, 'tournaments.html')
