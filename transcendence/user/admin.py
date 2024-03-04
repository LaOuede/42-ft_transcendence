from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
	list_display = ('id', 'username', 'email', 'activity', 'password')

admin.site.register(User, UserAdmin)
