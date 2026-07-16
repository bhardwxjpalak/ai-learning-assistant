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

    def retrieve(
        self,
        query: str,
        top_k: int = settings.TOP_K,
    ) -> list[dict]:
        """
        Retrieve the most relevant chunks for a query.
        """

        query_embedding = self.embedding_service.embed_query(query)

        results = self.vector_store.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
        )
        if not results.get("documents"):
            return []

        retrieved_chunks = []

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances,
        ):
            retrieved_chunks.append(
                {
                    "text": document,
                    "page": metadata["page"],
                    "document": metadata["document"],
                    "chunk_id": metadata["chunk_id"],
                    "score": distance,
                }
            )
        logger.info("Retrieved %d chunks for query.", len(retrieved_chunks))
        return retrieved_chunks