import os

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.document import Document
from app.services.vector_store import VectorStore
from app.core.config import settings

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.get("/")
async def get_documents():

    db: Session = SessionLocal()

    try:

        documents = db.query(Document).all()

        return [
            {
                "id": doc.id,
                "filename": doc.filename,
                "total_pages": doc.total_pages,
                "total_chunks": doc.total_chunks,
                "status": doc.status,
                "upload_time": doc.upload_time,
            }
            for doc in documents
        ]

    finally:
        db.close()


@router.delete("/{document_id}")
async def delete_document(document_id: int):

    db: Session = SessionLocal()

    try:

        document = (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if document is None:
            raise HTTPException(
                status_code=404,
                detail="Document not found.",
            )

        # Delete all vectors from ChromaDB
        vector_store = VectorStore()
        vector_store.delete_document(document.filename)

        # Delete uploaded PDF
        upload_path = os.path.join(
            settings.UPLOAD_DIRECTORY,
            document.filename,
        )

        if os.path.exists(upload_path):
            os.remove(upload_path)

        # Delete SQLite record
        db.delete(document)
        db.commit()

        return {
            "message": "Document deleted successfully."
        }

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:
        db.close()