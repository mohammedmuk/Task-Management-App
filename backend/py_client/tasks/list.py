import requests

endpoint = "http://localhost:8000/api/v1/token/"


data = { "identifier" : "[EMAIL_ADDRESS]",
        "password" : "testpassword121210"}

response = requests.post(endpoint, data=data)

if response.status_code == 200:
    endpoint = "http://localhost:8000/api/v1/tasks/"
    header = {
        "Authorization" : f"Bearer {response.json()['access']}"
    }

    response = requests.get(endpoint, headers=header)
    print(response.json())