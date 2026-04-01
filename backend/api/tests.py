from rest_framework.test import APITestCase
from .models import User
from django.urls import reverse
from rest_framework import status


# Create your tests here.



class TestUserView(APITestCase):

    def test_create_user(self):
        ## Define a new user

        data = {"username" : "test1user", 
                "email" : "test1user@gmail.com", 
                "password" : "km1122334455"}
        
        url = reverse("users", kwargs={"version": "v1"})
        response = self.client.post(url, data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data["username"], response.data["username"])

        # Define a new user with invalid password

        data = {"username" : "test1user", 
                "email" : "test1user@gmail.com", 
                "password" : "1234"}
        
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["password"][0], "Password was very short.")


class TestTaskView(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser2",
            email="testuser2@gmail.com",
            password="testuser212345",
            is_active=True
        )

    def authenticate(self):
        data = {
            "username" : "testuser2",
            "password" : "testuser212345"
        }

        url = reverse("token_obtain_pair")
    
        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data['access']

        return token


    def test_create_task(self):

        url = reverse("tasks", kwargs={"version" : "v1"})

        data = {
        "title" : "Front End Project",
        "description" : "No description"
        }

        token = self.authenticate()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.post(url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data['title'], response.data['title'])


    def test_get_tasks(self):
        url = reverse("tasks")

        token = self.authenticate()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
