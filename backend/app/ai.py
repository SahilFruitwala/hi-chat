from typing import Optional, Literal

from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.capabilities import Thinking, WebSearch


class AgentCore:
    def __init__(self, ):
        self.provider = GoogleProvider(api_key="KEY")

    def get_google_agent(
        self,
        model_name: str = "gemini-2.5-flash",
        thinking: Optional[Literal[None, "low", "medium", "high"]] = None,
        web_search: bool = False,
    ):
        assert model_name, "Model Name can't be empty"
        
        return Agent(
            model=GoogleModel(model_name, provider=self.provider),
            capabilities=[
                Thinking(effort=thinking or False),
                WebSearch(),
            ],
        )
