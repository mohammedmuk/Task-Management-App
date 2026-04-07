import requests

endpoint = "http://localhost:8000/api/v1/verify-email/"


data = {
    "email" : "[EMAIL_ADDRESS]",
    "code" : "564538"
}

response = requests.post(endpoint, data=data)

print(response.json())