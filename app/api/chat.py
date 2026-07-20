from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_pipeline import RAGPipeline
from app.core.logger import logger

router = APIRouter(prefix="/chat", tags=["Chat"])
rag_pipeline = RAGPipeline()
@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Answer a user's question using the RAG pipeline.
    """

    try:
        if not request.question.strip():
            raise HTTPException(
        status_code=400,
        detail="Question cannot be empty.",
    )
        result = rag_pipeline.answer(
            question=request.question,
            agent=request.agent,)

        return ChatResponse(
            answer=result["answer"],
        )

    except Exception as e:
        logger.exception(
        "Chat request failed."
    )
        raise HTTPException(
        status_code=500,
        detail="Failed to generate a response.",
    )
