from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'status', 'twoFA')

admin.site.register(Profile, ProfileAdmin)
