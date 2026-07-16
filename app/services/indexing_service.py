from pathlib import Path
from app.core.logger import logger
from app.database.database import SessionLocal
from app.models.document import Document
from app.services.pdf_parser import PDFParser
from app.services.chunker import Chunker
from app.services.embedding import EmbeddingService
from app.services.vector_store import VectorStore

class IndexingService:
    """
    Handles the complete indexing pipeline for a PDF document.

    Pipeline:
        PDF
            ↓
        Parse
            ↓
        Chunk
            ↓
        Embed
            ↓
        Store in ChromaDB
    """

    def __init__(self) -> None:
        self.parser = PDFParser()
        self.chunker = Chunker()
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStore()

    def index_document(
        self,
        file_path: str,
        document_name: str,
    ) -> None:
        """
        Parse, chunk, embed and store a PDF document.
        """

        logger.info("Starting indexing for '%s'.", document_name)
        if self.vector_store.document_exists(document_name):
            logger.info("Document '%s' is already indexed.", document_name,)
            return

        # -----------------------------
        # Parse PDF
        # -----------------------------
        pages = self.parser.parse(file_path)

        logger.info(
            "Parsed %d pages.",
            len(pages),
        )

        # -----------------------------
        # Create chunks
        # -----------------------------
        chunks = self.chunker.split(pages)

        logger.info(
            "Created %d chunks.",
            len(chunks),
        )

        # -----------------------------
        # Generate embeddings
        # -----------------------------
        texts = [
            chunk["text"]
            for chunk in chunks
        ]

        embeddings = self.embedding_service.embed_documents(
            texts
        )

        logger.info(
            "Generated %d embeddings.",
            len(embeddings),
        )

        # -----------------------------
        # Store vectors
        # -----------------------------
        self.vector_store.add_chunks(
    chunks=chunks,
    embeddings=embeddings,
    document_name=document_name,
)

        db = SessionLocal()

        try:
            document = Document(
        filename=document_name,
        total_pages=len(pages),
        total_chunks=len(chunks),
        status="INDEXED",
    )

            db.add(document)

            db.commit()

            logger.info(
        "Saved metadata for '%s'.",
        document_name,
    )

        finally:
            db.close()

            logger.info(
    "Finished indexing '%s'.",
    document_name,
)