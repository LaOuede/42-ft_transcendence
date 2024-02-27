from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Game
from user.models import User

class GameTestCase(TestCase):
	def setUp(self):
		self.user1 = User.objects.create(username="Player1", email="player1@example.com", activity="OF")
		self.user2 = User.objects.create(username="Player2", email="player2@example.com", activity="ON")

	def test_game_creation(self):
		'''Test creating a new game'''
		client = APIClient()
		data = {
			'player1_id': self.user1.id,
			'player2_id': self.user2.id
		}
		response = client.post('/play/create/', data, format='json')
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Game.objects.filter(player1=self.user1, player2=self.user2).exists())

	def test_game_deletion(self):
		'''Test deleting a game'''
		game = Game.objects.create(player1=self.user1, player2=self.user2)
		client = APIClient()
		response = client.delete(f'/play/{game.id}/delete/')
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(Game.objects.filter(id=game.id).exists())

	def test_get_single_game(self):
		'''Test retrieving a single game'''
		game = Game.objects.create(player1=self.user1, player2=self.user2)
		client = APIClient()
		response = client.get(f'/play/{game.id}/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], game.id)
		self.assertEqual(response.data['player1'], self.user1.id)
		self.assertEqual(response.data['player2'], self.user2.id)

	def test_get_all_games(self):
		'''Test retrieving all games'''
		Game.objects.create(player1=self.user1, player2=self.user2)
		client = APIClient()
		response = client.get('/play/games/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertTrue(len(response.data) > 0)

	def test_update_game(self):
		'''Test updating a game'''
		game = Game.objects.create(player1=self.user1, player2=self.user2)
		client = APIClient()
		updated_data = {
			'player1_score': 10,
			'player2_score': 5
		}
		response = client.patch(f'/play/{game.id}/update/', updated_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		game.refresh_from_db()
		self.assertEqual(game.player1_score, updated_data['player1_score'])
		self.assertEqual(game.player2_score, updated_data['player2_score'])