import requests

endpoint = "http://localhost:8000/api/v1/users/"


data = {"username" : "testuser", 
        "email" : "[EMAIL_ADDRESS]", 
        "password" : "testuser121210"}


response = requests.post(endpoint, data=data)

print(response.json())