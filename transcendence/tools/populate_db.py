import requests

class Color:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'

def check_database():
    url = "http://127.0.0.1:8000/users/"
    response = requests.get(url)
    return response.status_code == 200 and len(response.json()) > 0

def create_user(username, email, password):
    url = "http://127.0.0.1:8000/users/create/"
    data = {
        "username": username,
        "email": email,
        "password": password
    }
    response = requests.post(url, data=data)
    if response.status_code == 201:
        print(f"{Color.GREEN}[SUCCESS]{Color.RESET} User '{username}' created successfully.")
    else:
        print(f"{Color.RED}[ERROR]{Color.RESET} Failed to create user '{username}'. Error: {response.text}")

def populate_database():
    print(f"{Color.BOLD}Checking if the database is populated...{Color.RESET}")
    if check_database():
        print(f"{Color.YELLOW}[WARNING]{Color.RESET} Database is already populated.")
    else:
        users = [
            {"username": "Alex", "email": "alex@example.com", "password": "pass"},
            {"username": "Bob", "email": "bob@example.com", "password": "pass"},
            {"username": "Chet", "email": "chet@example.com", "password": "pass"},
            {"username": "Dave", "email": "dave@example.com", "password": "pass"},
            {"username": "Edward", "email": "edward@example.com", "password": "pass"},
            {"username": "Frank", "email": "frank@example.com", "password": "pass"}
        ]
        print(f"{Color.BOLD}Populating the database...{Color.RESET}")
        for user in users:
            create_user(user["username"], user["email"], user["password"])

populate_database()
