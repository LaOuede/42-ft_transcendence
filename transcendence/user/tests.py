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


class UserCreateAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        # Data for creating a user
        user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'test@example.com'
        }

        # Make a POST request to create a user
        response = self.client.post('/create/', user_data, format='json')

        # Check if the response status code is 201 (created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the user is created in the database
        self.assertTrue(Profile.objects.filter(username='testuser').exists())
