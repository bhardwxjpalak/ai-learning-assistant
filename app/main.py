from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router

app= FastAPI( 
    title="AI Learning Assistant",
    version="1.0.0",
    description="A RAG-based Learning Assistant using open-source LLMs"
)

app.include_router(upload_router, prefix="/api")
app.include_router(chat_router)
@app.get("/")
async def home():
    return{
        "status": "healthy",
        "project": "AI learning Assistant",
        "version": "1.0.0"
    }