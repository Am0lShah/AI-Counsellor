from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
import uuid


class ProfileStrength(BaseModel):
    """Profile strength analysis schema."""
    academic: str  # strong, average, weak
    exams: str  # completed, in_progress, not_started
    sop: str  # ready, draft, not_started
    overall_score: int  # 0-100


class StageInfo(BaseModel):
    """Current stage information schema."""
    current_stage: int  # 1-4
    stage_name: str
    stage_description: str
    is_locked: bool
    next_action: str


class TodoItem(BaseModel):
    """Todo item schema."""
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: str
    priority: str
    deadline: Optional[date] = None
    is_complete: bool
    
    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    """Dashboard data response schema."""
    profile_strength: ProfileStrength
    stage_info: StageInfo
    todos: List[TodoItem]
    shortlisted_count: int
    locked_count: int
