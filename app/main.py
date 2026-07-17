from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.documents import router as documents_router
app = FastAPI(
    title="AI Learning Assistant",
    version="1.0.0",
    description="A RAG-based Learning Assistant using open-source LLMs"
)
# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# API Routes
# ----------------------------
app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
# ----------------------------
# Health Check
# ----------------------------
@app.get("/")
async def home():
    return {
        "status": "healthy",
        "project": "AI Learning Assistant",
        "version": "1.0.0"
    }