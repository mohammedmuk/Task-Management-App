import requests

endpoint = "http://localhost:8000/api/v1/forgot-password/"

data = { "email" : "[EMAIL_ADDRESS]", 
         "password" : "testpassword121210",
         "code" : "817857"}


response = requests.patch(endpoint, data=data)

print(response.json())