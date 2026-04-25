from typing import Optional, Literal

from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.providers.groq import GroqProvider

from pydantic_ai.capabilities import Thinking, WebSearch


class AgentCore:
    @staticmethod
    def get_agent(model_name: str, model_provider: str):
        if model_provider == "groq":
            return AgentCore.get_groq_agent(model_name)

        return AgentCore.get_google_agent(model_name)

    @staticmethod
    def get_google_agent(
        model_name: str,
        thinking: Optional[Literal[None, "low", "medium", "high"]] = None,
        web_search: bool = False,
    ):
        assert model_name, "Model Name can't be empty"
        provider = GoogleProvider(api_key="KEY")

        return Agent(
            model=GoogleModel(model_name, provider=provider),
            capabilities=[
                Thinking(effort=thinking or False),
                WebSearch(),
            ],
        )

    @staticmethod
    def get_groq_agent(
        model_name: str,
        thinking: Optional[Literal[None, "low", "medium", "high"]] = None,
        web_search: bool = False,
    ):
        assert model_name, "Model Name can't be empty"
        provider = GroqProvider(api_key="dummy")

        return Agent(
            model=GroqModel(model_name, provider=provider),
            capabilities=[
                Thinking(effort=thinking or False),
            ],
        )
