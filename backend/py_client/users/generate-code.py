import requests

endpoint = "http://localhost:8000/api/v1/generate-code/"


data = {"email" : "[EMAIL_ADDRESS]", 
        "endpoint" : "account-activation"}

response = requests.post(endpoint, data=data)

print(response.json())