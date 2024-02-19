from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile

class ProfileTestCase(TestCase):
    def setUp(self):
        Profile.objects.create(
            username="UserTest",
            email="UserTest@gmail.com",
            activity="OF",
        )
        Profile.objects.create(
            username="BozoTest",
            email="BozoTest@gmail.com",
            activity="ON"
        )
        Profile.objects.create(
            username="CheckTest",
            email="CheckTest@gmail.com",
            activity="UN"
        )

    def test_user(self):
        '''Normal check for <UserTest> that was added to the database'''
        user = Profile.objects.get(username="UserTest")
        self.assertEqual(user.email, "UserTest@gmail.com")
        self.assertEqual(user.activity, "OF")
    
    def test_bozo(self):
        '''Normal check for <BozoTest> that was added to the database'''
        user = Profile.objects.get(username="BozoTest")
        self.assertEqual(user.email, "BozoTest@gmail.com")
        self.assertEqual(user.activity, "ON")
    
    def test_check(self):
        '''Normal check for <CheckTest> that was added to the database'''
        user = Profile.objects.get(username="CheckTest")
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
        self.assertTrue(Profile.objects.filter(username='testuser').exists())

    def test_create_user_with_empty_fields(self):
        '''Test creating a user profile with empty fields'''
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
        '''Test creating a user profile with invalid email format'''
        invalid_email_user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'invalid_email_format'
        }

        response = self.client.post('/users/create/', invalid_email_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Enter a valid email address.', response.data['email'])


class ProfileDeleteAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_delete_user(self):
        '''Test deleting a user profile'''
        profile = Profile.objects.create(
            username="DeleteTest",
            email="delete@test.com",
            activity="OF"
        )

        response = self.client.delete(f'/users/{profile.id}/delete/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Profile.objects.filter(username='DeleteTest').exists())

    def test_delete_nonexistent_user(self):
        '''Test deleting a user profile that does not exist'''
        nonexistent_profile_id = 9999  # Assuming this ID does not exist in the database

        response = self.client.delete(f'/users/{nonexistent_profile_id}/delete/')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Profile not found.', response.data['detail'])

class ProfileUpdateTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.profile = Profile.objects.create(
            username="testuser",
            email="test@example.com",
            activity="ON"
        )

    def test_partial_update_profile(self):
        updated_data = {
            "activity": "OF"
        }
        response = self.client.patch(f"/users/{self.profile.id}/update/", updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.activity, "OF")

    def test_full_update_profile(self):
        updated_data = {
            "username": "updateduser",
            "email": "updated@example.com",
            "activity": "UN"
        }
        response = self.client.patch(f"/users/{self.profile.id}/update/", updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.username, "updateduser")
        self.assertEqual(self.profile.email, "updated@example.com")
        self.assertEqual(self.profile.activity, "UN")

    def test_invalid_update_profile(self):
        updated_data = {
            "email": "invalidemail"
        }
        response = self.client.patch(f"/users/{self.profile.id}/update/", updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.profile.refresh_from_db()
        self.assertNotEqual(self.profile.email, "invalidemail")

    def test_update_nonexistent_profile(self):
        updated_data = {
            "activity": "OF"
        }
        response = self.client.patch("/users/1000/update/", updated_data, format='json')  # Nonexistent profile ID
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
