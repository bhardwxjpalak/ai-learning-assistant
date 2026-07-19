from app.services.agents import (
    KnowledgeAgent,
    SummaryAgent,
    ResearchAgent,
)


class AgentRouter:
    """
    Routes requests to the appropriate AI agent.
    """

    def __init__(self):
        self._agents = {
            "knowledge": KnowledgeAgent(),
            "summary": SummaryAgent(),
            "research": ResearchAgent(),
        }

    def get_agent(self, agent_name: str):
        """
        Returns the requested agent.
        Defaults to KnowledgeAgent if the agent is unknown.
        """

        return self._agents.get(
            agent_name.lower(),
            self._agents["knowledge"]
        )