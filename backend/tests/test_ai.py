from unittest.mock import MagicMock


def test_get_groq_agent_returns_agent(monkeypatch):
    from app import ai

    agent = object()
    monkeypatch.setattr(ai, "Agent", MagicMock(return_value=agent))
    monkeypatch.setattr(ai, "GroqModel", MagicMock(return_value="groq-model"))
    monkeypatch.setattr(ai, "GroqProvider", MagicMock(return_value="groq-prov"))
    monkeypatch.setattr(ai, "Thinking", MagicMock(return_value="think"))

    result = ai.AgentCore.get_groq_agent("custom-model", thinking="low")

    assert result is agent
    ai.GroqProvider.assert_called_once()
    ai.GroqModel.assert_called_once_with("custom-model", provider="groq-prov")
    ai.Agent.assert_called_once()
    call_kw = ai.Agent.call_args.kwargs
    assert call_kw["model"] == "groq-model"
    assert len(call_kw["capabilities"]) == 1


def test_get_google_agent_returns_agent(monkeypatch):
    from app import ai

    agent = object()
    monkeypatch.setattr(ai, "Agent", MagicMock(return_value=agent))
    monkeypatch.setattr(ai, "GoogleModel", MagicMock(return_value="g-model"))
    monkeypatch.setattr(ai, "GoogleProvider", MagicMock(return_value="g-prov"))
    monkeypatch.setattr(ai, "Thinking", MagicMock(return_value="think"))
    monkeypatch.setattr(ai, "WebSearch", MagicMock(return_value="web"))

    result = ai.AgentCore.get_google_agent(
        "gemini-test", thinking="medium", web_search=True
    )

    assert result is agent
    ai.GoogleProvider.assert_called_once()
    ai.GoogleModel.assert_called_once_with("gemini-test", provider="g-prov")
    call_kw = ai.Agent.call_args.kwargs
    assert len(call_kw["capabilities"]) == 2
