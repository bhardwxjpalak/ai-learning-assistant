import re

from app.services.embedding import EmbeddingService
from app.services.vector_store import VectorStore
from app.core.config import settings
from app.core.logger import logger


class Retriever:
    """
    Retrieves the most relevant document chunks
    for a user query.
    """

    def __init__(self) -> None:
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStore()

    def _keyword_score(
        self,
        query: str,
        text: str,
    ) -> float:
        """
        Calculate simple keyword overlap score.
        """

        query_words = set(
            re.findall(r"\w+", query.lower())
        )

        text_words = set(
            re.findall(r"\w+", text.lower())
        )

        if not query_words:
            return 0.0

        overlap = len(query_words.intersection(text_words))

        return overlap / len(query_words)

    def retrieve(
        self,
        query: str,
        top_k: int = settings.TOP_K,
    ) -> list[dict]:
        """
        Retrieve the most relevant chunks using
        hybrid semantic + keyword ranking.
        """

        query_embedding = self.embedding_service.embed_query(query)

        results = self.vector_store.collection.query(
            query_embeddings=[query_embedding],
            n_results=settings.TOP_K_INITIAL,
        )

        if not results.get("documents"):
            return []

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]

        retrieved_chunks = []

        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances,
        ):

            semantic_score = 1 / (1 + distance)

            keyword_score = self._keyword_score(
                query=query,
                text=document,
            )

            combined_score = (
                settings.SEMANTIC_WEIGHT * semantic_score
                + settings.KEYWORD_WEIGHT * keyword_score
            )

            retrieved_chunks.append(
                {
                    "text": document,
                    "page": metadata["page"],
                    "document": metadata["document"],
                    "chunk_id": metadata["chunk_id"],
                    "semantic_score": semantic_score,
                    "keyword_score": keyword_score,
                    "combined_score": combined_score,
                }
            )

        retrieved_chunks.sort(
            key=lambda x: x["combined_score"],
            reverse=True,
        )

        retrieved_chunks = retrieved_chunks[:top_k]

        logger.info(
            "Retrieved %d reranked chunks.",
            len(retrieved_chunks),
        )

        return retrieved_chunks