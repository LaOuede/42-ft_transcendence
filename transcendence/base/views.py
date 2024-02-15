from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response

def is_ajax(request):
    return request.headers.get('X-Requested-With') == 'XMLHttpRequest'

def index(request):
    if is_ajax(request):
        return render(request, './index.html')
    return render(request, './base.html')

def play(request):
    if is_ajax(request):
        return render(request, './play.html')
    return render(request, './base.html')

def tournaments(request):
    if is_ajax(request):
        return render(request, './tournaments.html')
    return render(request, './base.html')
