from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.user import User, Onboarding
from schemas.onboarding import OnboardingRequest, OnboardingResponse
from utils.dependencies import get_current_user

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.post("/", response_model=OnboardingResponse, status_code=status.HTTP_201_CREATED)
def submit_onboarding(
    request: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit or update onboarding data."""
    
    # Check if onboarding already exists
    onboarding = db.query(Onboarding).filter(
        Onboarding.user_id == current_user.id
    ).first()
    
    if onboarding:
        # Update existing
        for key, value in request.dict().items():
            setattr(onboarding, key, value)
        
        onboarding.is_complete = True
        onboarding.completed_at = datetime.utcnow()
    else:
        # Create new
        onboarding = Onboarding(
            user_id=current_user.id,
            **request.dict(),
            is_complete=True,
            completed_at=datetime.utcnow()
        )
        db.add(onboarding)
    
    db.commit()
    db.refresh(onboarding)
    
    return onboarding


@router.get("/", response_model=OnboardingResponse)
def get_onboarding(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's onboarding data."""
    
    onboarding = db.query(Onboarding).filter(
        Onboarding.user_id == current_user.id
    ).first()
    
    if not onboarding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Onboarding data not found"
        )
    
    return onboarding


@router.get("/status")
def get_onboarding_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user has completed onboarding."""
    
    onboarding = db.query(Onboarding).filter(
        Onboarding.user_id == current_user.id
    ).first()
    
    return {
        "is_complete": onboarding.is_complete if onboarding else False,
        "exists": onboarding is not None
    }
