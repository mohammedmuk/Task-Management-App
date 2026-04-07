import requests

endpoint = "http://localhost:8000/api/token/"


data = { "identifier" : "[EMAIL_ADDRESS]",
        "password" : "testuser121210"}


response = requests.post(endpoint, data=data)

if response.status_code == 200:
    endpoint = "http://localhost:8000/api/v1/tasks/"
    header = {
        "Authorization" : f"Bearer {response.json()['access']}"
    }

    response = requests.delete(endpoint, headers=header)
    print(response)