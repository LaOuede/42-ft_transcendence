from django.shortcuts import render
from django.http import HttpResponse
from user.models import User

# Create your views here.
def FriendsList(request):

    allUsers = User.objects.filter(is_staff=False)
    activity_enum = {e[0]: e[1] for e in User.activity_enum}

    return render(
        request, "friends/list.html",
        {
            "friends_list": allUsers,
            "activity_enum": activity_enum
        }
    )