from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile

class ProfileTestCase(TestCase):
    def setUp(self):
        Profile.objects.create(
            username="UserTest",
            email="UserTest@gmail.com",
            status="OF",
        )
        Profile.objects.create(
            username="BozoTest",
            email="BozoTest@gmail.com",
            status="ON"
        )
        Profile.objects.create(
            username="CheckTest",
            email="CheckTest@gmail.com",
            status="UN"
        )

    def test_user(self):
        '''Normal check for <UserTest> that was added to the database'''
        user = Profile.objects.get(username="UserTest")
        self.assertEqual(user.email, "UserTest@gmail.com")
        self.assertEqual(user.status, "OF")
    
    def test_bozo(self):
        '''Normal check for <BozoTest> that was added to the database'''
        user = Profile.objects.get(username="BozoTest")
        self.assertEqual(user.email, "BozoTest@gmail.com")
        self.assertEqual(user.status, "ON")
    
    def test_check(self):
        '''Normal check for <CheckTest> that was added to the database'''
        user = Profile.objects.get(username="CheckTest")
        self.assertEqual(user.email, "CheckTest@gmail.com")
        self.assertEqual(user.status, "UN")

    def test_delete_user(self):
        '''Test deleting a user profile'''
        profile = Profile.objects.create(
            username="DeleteTest",
            email="delete@test.com",
            status="OF"
        )

        response = self.client.delete(f'/users/{profile.id}/delete/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Profile.objects.filter(username='DeleteTest').exists())

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


