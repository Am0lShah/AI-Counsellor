from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User, Todo
from models.university import UserUniversity
from schemas.dashboard import DashboardResponse, ProfileStrength, StageInfo, TodoItem
from services.profile_service import calculate_profile_strength, determine_stage
from utils.dependencies import require_onboarding_complete

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get dashboard data including profile strength, stage, and todos."""
    
    onboarding = current_user.onboarding
    
    # Calculate profile strength
    strength_data = calculate_profile_strength(onboarding)
    profile_strength = ProfileStrength(**strength_data)
    
    # Get university counts
    shortlisted_count = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.status == "shortlisted"
    ).count()
    
    locked_count = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.status == "locked"
    ).count()
    
    # Determine stage
    stage_data = determine_stage(onboarding, shortlisted_count, locked_count)
    stage_info = StageInfo(**stage_data)
    
    # Get todos (top 10, incomplete first)
    todos = db.query(Todo).filter(
        Todo.user_id == current_user.id
    ).order_by(
        Todo.is_complete.asc(),
        Todo.priority.desc(),
        Todo.created_at.desc()
    ).limit(10).all()
    
    return DashboardResponse(
        profile_strength=profile_strength,
        stage_info=stage_info,
        todos=todos,
        shortlisted_count=shortlisted_count,
        locked_count=locked_count
    )
