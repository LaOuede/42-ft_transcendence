from django.urls import path
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('play/', views.play, name='play'),
    path('tournaments/', views.tournaments, name='tournaments'),
    path('admin/', admin.site.urls),
]

