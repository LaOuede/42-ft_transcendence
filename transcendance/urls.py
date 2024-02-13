from django.urls import path
from django.contrib import admin
from . import views

urlpatterns = [
    # AUTH
    path('signup/', views.signup,  name='signup'),  # Sign up page
    # MAIN APP
    path('', views.index, name='index'),
    path('play/', views.play, name='play'),
    path('tournaments/', views.tournaments, name='tournaments'),
    path('admin/', admin.site.urls),
]

