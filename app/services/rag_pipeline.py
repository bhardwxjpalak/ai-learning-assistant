from app.services.llm import LLMService
from app.services.prompt_builder import PromptBuilder
from app.services.retriever import Retriever
from app.core.config import settings
from app.core.logger import logger

class RAGPipeline:
    """
    End-to-end Retrieval-Augmented Generation pipeline.
    """
    def __init__(self) -> None:
        self.retriever = Retriever()
        self.prompt_builder = PromptBuilder()
        self.llm = LLMService()

    def answer(self,
            question: str,
        top_k: int = settings.TOP_K,
    ) -> dict:
        """
        Generate an answer using the RAG pipeline.
        """
        
        logger.info("Received question: %s",question,)
        if not question.strip():
            return {
        "answer": "Please enter a question.",
        "sources": [],
    }
        chunks = self.retriever.retrieve(
            query=question,
            top_k=top_k,
        )
        logger.info("Retrieved %d chunks.", len(chunks))
        if not chunks:
            return {
                "answer": "I couldn't find the answer in the uploaded documents.",
                "sources": [],
            }

        prompt = self.prompt_builder.build(
            question=question,
            chunks=chunks,
        )

        answer = self.llm.generate(prompt)
        logger.info(
    "Generated response successfully."
)
        sources = []

        seen = set()

        for chunk in chunks:

            key = (
                chunk["document"],
                chunk["page"],
            )

            if key not in seen:
                seen.add(key)

                sources.append(
                    {
                        "document": chunk["document"],
                        "page": chunk["page"],
                    }
                )

        return {
            "answer": answer,
            "sources": sources,
        }