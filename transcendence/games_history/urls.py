from django.urls import path
from games_history.views import CreateGame

urlpatterns = [
	path("create/", CreateGame.as_view(), name="game-create"),
]