from django.http import HttpResponse
from django.shortcuts import render
from user.models import Profile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ProfileSerializer

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

class ProfileCreateView(APIView):
    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)