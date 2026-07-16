from typing import List
import chromadb
from chromadb.config import Settings
from app.core.config import settings
from app.core.logger import logger
class VectorStore:
    """
    Handles storing and retrieving document embeddings using ChromaDB.
    """

    def __init__(
        self,
        persist_directory: str = settings.CHROMA_DB_PATH,
        collection_name: str = settings.CHROMA_COLLECTION,
    ) -> None:

        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False),
        )

        self.collection = self.client.get_or_create_collection(
            name=collection_name
        )

    def add_chunks(
        self,
        chunks: List[dict],
        embeddings: List[List[float]],
        document_name: str,
    ) -> None:
        """
        Store chunks and their embeddings in ChromaDB.
        """

        ids = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):

            ids.append(f"{document_name}_{chunk['page']}_{chunk['chunk_id']}")

            documents.append(chunk["text"])

            metadatas.append(
                {
                    "document": document_name,
                    "page": chunk["page"],
                    "chunk_id": chunk["chunk_id"],
                }
            )
        
        try:
            self.collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )
            logger.info(
        "Stored %d chunks for document '%s'.",
        len(ids),
        document_name,
    )

        except Exception as e:
            logger.exception(
        "Failed to store vectors for document '%s'.",
        document_name,
    )

            raise RuntimeError(
        f"Failed to store vectors in ChromaDB: {e}"
    )
    def document_exists(self,document_name: str,) -> bool:
        """
        Check whether a document has already been indexed.
        """
        result = self.collection.get(where={"document": document_name} )

        return len(result["ids"]) > 0