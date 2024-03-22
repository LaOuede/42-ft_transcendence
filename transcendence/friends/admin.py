from django.contrib import admin
from .models import FriendRequest, FriendList

# Register your models here.
class FriendListAdmin(admin.ModelAdmin):
    list_display = ['user']
    search_fields = ['user']
    # readonly_fields = ['user']

    class Meta:
        model = FriendList


class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ["from_user"]
    list_filter = ["from_user"]

    class Meta:
        model = FriendRequest

admin.site.register(FriendList, FriendListAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)