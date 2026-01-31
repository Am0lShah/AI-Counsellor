from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime
import uuid


class ChatMessage(BaseModel):
    """Chat message schema."""
    role: str  # user, assistant
    message: str
    created_at: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Chat request schema."""
    message: str


class ChatAction(BaseModel):
    """Structured action from AI."""
    type: str  # shortlist_university, lock_university, create_todo, update_stage
    data: Dict[str, Any]


class ChatResponse(BaseModel):
    """Chat response schema."""
    message: str
    actions: Optional[List[Dict[str, Any]]] = None
    suggested_questions: Optional[List[str]] = None


class ChatHistoryResponse(BaseModel):
    """Chat history response schema."""
    id: uuid.UUID
    role: str
    message: str
    actions: Optional[Any] = None
    suggested_questions: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
