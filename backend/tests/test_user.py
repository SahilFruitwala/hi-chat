from app import models
import time


def test_create_user(client):
    response = client.post(
        "/users/",
        json={"name": "Test User"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert "id" in data


def test_read_user(client):
    # Create a user first
    response = client.post(
        "/users/",
        json={"name": "Test User 2"},
    )
    user_id = response.json()["id"]

    # Read the user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User 2"


def test_read_user_not_found(client):
    response = client.get("/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_read_users(client):
    # Create two users
    client.post("/users/", json={"name": "User 1"})
    client.post("/users/", json={"name": "User 2"})

    # Read all users
    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "User 1"
    assert data[1]["name"] == "User 2"


def test_create_chat(client, db):
    # Create user first
    user_response = client.post(
        "/users/",
        json={"name": "Chat User"},
    )
    user_id = user_response.json()["id"]

    response = client.post(
        f"/users/{user_id}/chats",
        json={"message": "Hello", "model": "test-model"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["messages"][0]["message"] == "Hello"
    assert "id" in data

    db_chat = db.query(models.Chat).filter(models.Chat.id == data["id"]).first()
    assert db_chat is not None
    assert db_chat.user_id == user_id
    assert db_chat.title == "Hello"
    assert db_chat.messages[0].message == "Hello"
    assert db_chat.messages[0].created_by == "user"
    assert db_chat.messages[0].model == "test-model"
    assert db_chat.messages[1].message == "Echo: Hello"
    assert db_chat.messages[1].created_by == "bot"
    assert db_chat.messages[1].model == "test-model"


def test_read_chat(client, db):
    user_response = client.post(
        "/users/",
        json={"name": "Chat User"},
    )
    user_id = user_response.json()["id"]

    response = client.post(
        f"/users/{user_id}/chats",
        json={"message": "Hello", "model": "test-model"},
    )
    chat_id = response.json()["id"]

    response = client.get(f"/users/{user_id}/chats/{chat_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == chat_id
    assert data["user_id"] == user_id
    assert data["messages"][0]["message"] == "Hello"
    assert data["messages"][0]["created_by"] == "user"
    assert data["messages"][0]["model"] == "test-model"
    assert data["messages"][1]["message"] == "Echo: Hello"
    assert data["messages"][1]["created_by"] == "bot"
    assert data["messages"][1]["model"] == "test-model"


def test_read_chat_not_found(client):
    user_response = client.post(
        "/users/",
        json={"name": "Chat User"},
    )
    user_id = user_response.json()["id"]
    response = client.get(f"/users/{user_id}/chats/999")
    assert response.status_code == 404


def test_read_chats(client):
    user_response = client.post(
        "/users/",
        json={"name": "Chat User"},
    )
    user_id = user_response.json()["id"]

    client.post(
        f"/users/{user_id}/chats",
        json={"message": "Hello1", "model": "test-model-1"},
    )
    time.sleep(1.1)  # Ensure different created_at
    client.post(
        f"/users/{user_id}/chats",
        json={"message": "Hello2", "model": "test-model-2"},
    )

    response = client.get(f"/users/{user_id}/chats")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["user_id"] == user_id
    assert data[1]["user_id"] == user_id
    # Newest first (desc order)
    assert data[0]["title"] == "Hello2"
    assert data[1]["title"] == "Hello1"


def test_read_chats_with_invalid_user(client):
    # Use a non-existent user ID
    invalid_user_id = 9999
    response = client.get(f"/users/{invalid_user_id}/chats")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0


def test_create_message(client, db):
    user_response = client.post(
        "/users/",
        json={"name": "Chat User"},
    )
    user_id = user_response.json()["id"]

    response = client.post(
        f"/users/{user_id}/chats",
        json={"message": "Hello", "model": "test-model"},
    )
    chat_id = response.json()["id"]

    response = client.post(
        f"/chats/{chat_id}/messages",
        json={"message": "Hello Again", "created_by": "user", "model": "test-model"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Echo: Hello Again"
    assert data["created_by"] == "bot"
    assert data["chat_id"] == chat_id
    assert data["model"] == "test-model"
    assert "id" in data

    db_message = (
        db.query(models.Message).filter(models.Message.id == data["id"]).first()
    )
    assert db_message is not None
    assert db_message.message == "Echo: Hello Again"
    assert db_message.created_by == "bot"
    assert db_message.model == "test-model"
    assert db_message.chat_id == chat_id
