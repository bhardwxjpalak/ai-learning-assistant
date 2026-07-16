from pydantic import BaseModel
class ChatRequest(BaseModel):
    question: str

class SourceResponse(BaseModel):
    document: str
    page: int

class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceResponse]