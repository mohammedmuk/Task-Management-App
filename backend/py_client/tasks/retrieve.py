import requests

endpoint = "http://localhost:8000/api/token/"


data = { "identifier" : "[EMAIL_ADDRESS]",
        "password" : "testuser121210"}



response = requests.post(endpoint, data=data)

if response.status_code == 200:
    endpoint = "http://localhost:8000/api/v1/tasks/f45c5a77-98b8-4e60-b013-ac9c97b869e9/"
    header = {
        "Authorization" : f"Bearer {response.json()['access']}"
    }

    response = requests.get(endpoint, headers=header)
    print(response.json())