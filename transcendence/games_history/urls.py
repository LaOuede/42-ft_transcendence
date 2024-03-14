from django.urls import path
from games_history.views import CreateGame, GameGetOne, GameGetAll, GameDelete, GameUpdate

urlpatterns = [
	path("create/", CreateGame.as_view(), name="game-create"),
	path("<int:game_id>/", GameGetOne.as_view(), name="game-detail"),
	path("games/", GameGetAll.as_view(), name="games-all"),
	path("<int:game_id>/delete/", GameDelete.as_view(), name="game-delete"),
	path("<int:game_id>/update/", GameUpdate.as_view(), name="game-update"),
]