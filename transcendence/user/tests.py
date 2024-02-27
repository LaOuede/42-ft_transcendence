from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class UserTestCase(TestCase):
	def setUp(self):
		User.objects.create(
			username="UserTest",
			email="UserTest@gmail.com",
			activity="OF",
		)
		User.objects.create(
			username="BozoTest",
			email="BozoTest@gmail.com",
			activity="ON"
		)
		User.objects.create(
			username="CheckTest",
			email="CheckTest@gmail.com",
			activity="UN"
		)

	def test_user(self):
		'''Normal check for <UserTest> that was added to the database'''
		user = User.objects.get(username="UserTest")
		self.assertEqual(user.email, "UserTest@gmail.com")
		self.assertEqual(user.activity, "OF")
	
	def test_bozo(self):
		'''Normal check for <BozoTest> that was added to the database'''
		user = User.objects.get(username="BozoTest")
		self.assertEqual(user.email, "BozoTest@gmail.com")
		self.assertEqual(user.activity, "ON")
	
	def test_check(self):
		'''Normal check for <CheckTest> that was added to the database'''
		user = User.objects.get(username="CheckTest")
		self.assertEqual(user.email, "CheckTest@gmail.com")
		self.assertEqual(user.activity, "UN")


class UserCreateAPIViewTestCase(TestCase):
	def setUp(self):
		self.client = APIClient()

	def test_create_user(self):
		user_data = {
			'username': 'testuser',
			'password': 'testpassword',
			'email': 'test@example.com'
		}

		response = self.client.post('/users/create/', user_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(User.objects.filter(username='testuser').exists())

	def test_create_user_with_empty_fields(self):
		'''Test creating a user user with empty fields'''
		empty_user_data = {
			'username': '',
			'password': '',
			'email': ''
		}

		response = self.client.post('/users/create/', empty_user_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('This field may not be blank.', response.data['username'])
		self.assertIn('This field may not be blank.', response.data['password'])
		self.assertIn('This field may not be blank.', response.data['email'])

	def test_create_user_with_invalid_email_format(self):
		'''Test creating a user user with invalid email format'''
		invalid_email_user_data = {
			'username': 'testuser',
			'password': 'testpassword',
			'email': 'invalid_email_format'
		}

		response = self.client.post('/users/create/', invalid_email_user_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('Enter a valid email address.', response.data['email'])


class UserDeleteAPIViewTestCase(TestCase):
	def setUp(self):
		self.client = APIClient()

	def test_delete_user(self):
		'''Test deleting a user user'''
		user = User.objects.create(
			username="DeleteTest",
			email="delete@test.com",
			activity="OF"
		)

		response = self.client.delete(f'/users/{user.id}/delete/')
		
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(User.objects.filter(username='DeleteTest').exists())

	def test_delete_nonexistent_user(self):
		'''Test deleting a user user that does not exist'''
		nonexistent_user_id = 9999  # Assuming this ID does not exist in the database

		response = self.client.delete(f'/users/{nonexistent_user_id}/delete/')
		
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertIn('User not found.', response.data['detail'])

class UserUpdateTestCase(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = User.objects.create(
			username="testuser",
			email="test@example.com",
			activity="ON"
		)

	def test_partial_update_user(self):
		updated_data = {
			"activity": "OF"
		}
		response = self.client.patch(f"/users/{self.user.id}/update/", updated_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.user.refresh_from_db()
		self.assertEqual(self.user.activity, "OF")

	def test_full_update_user(self):
		updated_data = {
			"username": "updateduser",
			"email": "updated@example.com",
			"activity": "UN"
		}
		response = self.client.patch(f"/users/{self.user.id}/update/", updated_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.user.refresh_from_db()
		self.assertEqual(self.user.username, "updateduser")
		self.assertEqual(self.user.email, "updated@example.com")
		self.assertEqual(self.user.activity, "UN")

	def test_invalid_update_user(self):
		updated_data = {
			"email": "invalidemail"
		}
		response = self.client.patch(f"/users/{self.user.id}/update/", updated_data, format='json')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.user.refresh_from_db()
		self.assertNotEqual(self.user.email, "invalidemail")

	def test_update_nonexistent_user(self):
		updated_data = {
			"activity": "OF"
		}
		response = self.client.patch("/users/1000/update/", updated_data, format='json')  # Nonexistent user ID
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
