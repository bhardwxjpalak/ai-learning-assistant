from pathlib import Path
import shutil
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from app.services.document_loader import DocumentLoader
from app.core.config import settings
from app.core.logger import logger
from app.services.indexing_service import IndexingService

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = Path(settings.UPLOAD_DIRECTORY)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

loader = DocumentLoader()
indexer = IndexingService()
@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF and verify that it can be read.
    """

    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed."
        )

    file_path = UPLOAD_DIR / file.filename
    if file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A file with this name already exists."
        )

    try:
        # Save uploaded file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info("Uploaded file '%s'.",file.filename,)
        # Verify that PDF is readable
        text = loader.load_pdf(str(file_path))
        logger.info("Successfully validated '%s'.", file.filename,)
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PDF contains no readable text."
            )
        indexer.index_document(file_path=str(file_path), document_name=file.filename,)
    except HTTPException:
        raise

    except Exception as e:
        logger.exception("Failed to process '%s'.", file.filename,)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing PDF: {str(e)}"
        )

    return {
        "message": "PDF uploaded successfully.",
        "filename": file.filename,
        "pages_loaded": True
    }