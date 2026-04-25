from unittest.mock import MagicMock

from pydantic_ai import ModelRequest, UserPromptPart


def test_mock_bot_response_without_history(monkeypatch):
    fake_agent = MagicMock()
    fake_agent.run_sync.return_value = MagicMock(output="reply-a")

    class _Core:
        @staticmethod
        def get_agent(*a, **kw):
            return fake_agent

    monkeypatch.setattr("app.crud.AgentCore", _Core)

    from app.crud import mock_bot_response

    assert mock_bot_response("hello", "m1", "groq") == "reply-a"
    fake_agent.run_sync.assert_called_once_with("hello")


def test_mock_bot_response_with_history(monkeypatch):
    fake_agent = MagicMock()
    fake_agent.run_sync.return_value = MagicMock(output="reply-b")
    hist = [ModelRequest(parts=[UserPromptPart(content="prior")])]

    class _Core:
        @staticmethod
        def get_agent(*a, **kw):
            return fake_agent

    monkeypatch.setattr("app.crud.AgentCore", _Core)

    from app.crud import mock_bot_response

    assert mock_bot_response("next", "m1", "groq", hist) == "reply-b"
    fake_agent.run_sync.assert_called_once_with("next", message_history=hist)


def test_create_message_builds_history(monkeypatch, client, db):
    """User + bot turns in DB exercise ModelRequest / ModelResponse branches."""
    monkeypatch.setattr(
        "app.crud.mock_bot_response",
        lambda message, model, model_provider, message_history=None: f"Echo: {message}",
    )

    user_id = client.post("/users/", json={"name": "H"}).json()["id"]
    chat_id = client.post(
        f"/users/{user_id}/chats",
        json={"message": "First", "model": "m1", "model_provider": "groq"},
    ).json()["id"]

    response = client.post(
        f"/chats/{chat_id}/messages",
        json={
            "message": "Second",
            "created_by": "user",
            "model": "m2",
            "model_provider": "groq",
        },
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Echo: Second"
