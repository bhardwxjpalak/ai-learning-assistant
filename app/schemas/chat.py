from pydantic import BaseModel, Field
from typing import List
class Source(BaseModel):
    document: str
    page: int

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1)
    agent: str = Field(default="knowledge")

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]