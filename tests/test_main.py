def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}


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
    assert response.json()["detail"] == "Item not found"


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
