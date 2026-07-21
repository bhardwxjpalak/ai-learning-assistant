from app.services.llm import LLMService
from app.services.prompt_builder import PromptBuilder
from app.services.retriever import Retriever
from app.services.agent_router import AgentRouter
from app.core.config import settings
from app.core.logger import logger
import re
class RAGPipeline:
    """
    End-to-end Retrieval-Augmented Generation pipeline.
    """

    def __init__(self) -> None:
        self.retriever = Retriever()
        self.prompt_builder = PromptBuilder()
        self.llm = LLMService()
        self.agent_router = AgentRouter()

    def answer(
        self,
        question: str,
        agent: str = "knowledge",
        top_k: int = settings.TOP_K,
    ) -> dict:
        """
        Generate an answer using the selected AI agent.
        """

        logger.info("Received question: %s", question)
        logger.info("Selected agent: %s", agent)

        if not question.strip():
            return {
                "answer": "Please enter a question."
                
            }

        chunks = self.retriever.retrieve(
            query=question,
            top_k=top_k,
        )

        logger.info("Retrieved %d chunks.", len(chunks))

        if not chunks:
            return {
                "answer": "I couldn't find the answer in the uploaded documents."
                
            }

        selected_agent = self.agent_router.get_agent(agent)

        system_prompt = selected_agent.get_system_prompt()

        prompt = self.prompt_builder.build(
            system_prompt=system_prompt,
            question=question,
            chunks=chunks,
        )

        answer = (self.llm.generate(prompt) or "").strip()
        # Remove "Sources" section
        answer = re.sub(
    r"\n*\s*Sources?:.*$",
    "",
    answer,
    flags=re.IGNORECASE | re.DOTALL,
)

# Remove common reference phrases
        patterns = [
    r"According to the document[:,]?\s*",
    r"According to the knowledge base[:,]?\s*",
    r"Based on the document[:,]?\s*",
    r"Based on the uploaded document[:,]?\s*",
]

        for pattern in patterns:
            answer = re.sub(
        pattern,
        "",
        answer,
        flags=re.IGNORECASE,
    )

        answer = answer.strip()
        if not answer:
            logger.warning("LLM returned an empty response.")
            answer = (
        "I couldn't generate a response. "
        "Please try again."
    )

        logger.info("Generated response successfully.")

        return {
    "answer": answer,
}