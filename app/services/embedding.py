from sentence_transformers import SentenceTransformer
from app.core.config import settings
from app.core.logger import logger
class EmbeddingService:
    """
    Generates embeddings for text using the
    BAAI/bge-base-en-v1.5 model.
    """

    def __init__(self) -> None:
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """
        Generate embeddings for multiple documents.
        """
        embeddings = self.model.encode(
            texts,
            batch_size=32,
            show_progress_bar=True,
            normalize_embeddings=True,
            convert_to_numpy=True,
        )
        
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        """
        Generate an embedding for a user query.
        """
        embedding = self.model.encode(
            query,
            normalize_embeddings=True,
            convert_to_numpy=True,
        )

        return embedding.tolist()