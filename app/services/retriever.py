import re
from collections import Counter

from app.core.config import settings
from app.core.logger import logger
from app.services.embedding import EmbeddingService
from app.services.vector_store import VectorStore


class Retriever:
    """
    Retrieves the most relevant chunks using
    hybrid semantic + lexical reranking.
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
        Computes a lexical relevance score using:
        - keyword coverage
        - keyword frequency
        - exact phrase bonus
        - length normalization
        """

        query_tokens = re.findall(r"\w+", query.lower())
        text_tokens = re.findall(r"\w+", text.lower())

        if not query_tokens or not text_tokens:
            return 0.0

        query_counter = Counter(query_tokens)
        text_counter = Counter(text_tokens)

        # -----------------------------------
        # 1. Coverage
        # -----------------------------------

        matched = sum(
            1
            for word in query_counter
            if word in text_counter
        )

        coverage_score = matched / len(query_counter)

        # -----------------------------------
        # 2. Frequency
        # -----------------------------------

        frequency_score = sum(
            min(text_counter[word], query_counter[word])
            for word in query_counter
            if word in text_counter
        )

        frequency_score /= len(query_tokens)

        # -----------------------------------
        # 3. Phrase bonus
        # -----------------------------------

        phrase_bonus = (
            0.10
            if query.lower() in text.lower()
            else 0.0
        )

        # -----------------------------------
        # 4. Length normalization
        # -----------------------------------

        length_factor = min(
            1.0,
            len(query_tokens) /
            max(len(text_tokens), 1)
        )

        lexical_score = (
            0.45 * coverage_score +
            0.35 * frequency_score +
            0.20 * length_factor
        )

        lexical_score += phrase_bonus

        return min(lexical_score, 1.0)

    def retrieve(
        self,
        query: str,
        top_k: int = settings.TOP_K,
    ) -> list[dict]:

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

            # -----------------------------
            # Semantic score
            # -----------------------------

            semantic_score = 1 / (1 + distance)

            # -----------------------------
            # Lexical score
            # -----------------------------

            keyword_score = self._keyword_score(
                query=query,
                text=document,
            )

            # -----------------------------
            # Hybrid score
            # -----------------------------

            combined_score = (
                settings.SEMANTIC_WEIGHT * semantic_score +
                settings.KEYWORD_WEIGHT * keyword_score
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

        # -----------------------------------------
        # Stable reranking
        # -----------------------------------------

        retrieved_chunks.sort(
            key=lambda chunk: (
                chunk["combined_score"],
                chunk["keyword_score"],
                chunk["semantic_score"],
            ),
            reverse=True,
        )

        retrieved_chunks = retrieved_chunks[:top_k]

        logger.info(
            "Retrieved %d reranked chunks.",
            len(retrieved_chunks),
        )

        return retrieved_chunks