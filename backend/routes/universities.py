from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.user import User
from models.university import University, UserUniversity
from schemas.university import (
    UniversityResponse,
    UserUniversityResponse,
    ShortlistRequest,
    LockRequest
)
from services.recommendation_service import (
    recommend_universities,
    categorize_university,
    generate_fit_analysis
)
from utils.dependencies import require_onboarding_complete

router = APIRouter(prefix="/universities", tags=["Universities"])


@router.get("/discover", response_model=List[UniversityResponse])
def discover_universities(
    limit: int = Query(20, ge=1, le=50),
    country: Optional[str] = None,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Discover universities based on user profile."""
    
    query = db.query(University)
    
    # Filter by country if specified
    if country:
        query = query.filter(University.country == country)
    
    # Filter by user's intended degree
    onboarding = current_user.onboarding
    query = query.filter(University.degree_type == onboarding.intended_degree)
    
    universities = query.limit(limit).all()
    
    return universities


@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get AI-powered university recommendations with categorization."""
    
    onboarding = current_user.onboarding
    recommendations = recommend_universities(db, onboarding, limit=20)
    
    result = []
    for rec in recommendations:
        result.append({
            "university": rec["university"],
            "category": rec["category"],
            "acceptance_likelihood": rec["acceptance_likelihood"],
            "fit_reason": rec["fit_reason"],
            "risk_factors": rec["risk_factors"]
        })
    
    return result


@router.post("/shortlist", status_code=status.HTTP_201_CREATED)
def shortlist_university(
    request: ShortlistRequest,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Shortlist a university."""
    
    # Check if already exists
    existing = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.university_id == request.university_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University already in your list"
        )
    
    # Get university
    university = db.query(University).filter(
        University.id == request.university_id
    ).first()
    
    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found"
        )
    
    # Calculate acceptance and fit
    onboarding = current_user.onboarding
    category, acceptance = categorize_university(onboarding, university)
    analysis = generate_fit_analysis(onboarding, university, category, acceptance)
    
    # Create user university
    user_uni = UserUniversity(
        user_id=current_user.id,
        university_id=request.university_id,
        status="shortlisted",
        category=request.category,
        acceptance_likelihood=acceptance,
        fit_reason=analysis["fit_reason"],
        risk_factors=analysis["risk_factors"]
    )
    
    db.add(user_uni)
    db.commit()
    db.refresh(user_uni)
    
    return {"message": "University shortlisted successfully", "id": user_uni.id}


@router.get("/shortlisted", response_model=List[UserUniversityResponse])
def get_shortlisted(
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get all shortlisted universities."""
    
    user_unis = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.status == "shortlisted"
    ).all()
    
    return user_unis


@router.post("/lock", status_code=status.HTTP_200_OK)
def lock_university(
    request: LockRequest,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Lock a shortlisted university."""
    
    # Find in shortlisted
    user_uni = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.university_id == request.university_id,
        UserUniversity.status == "shortlisted"
    ).first()
    
    if not user_uni:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University must be shortlisted first"
        )
    
    # Update status
    user_uni.status = "locked"
    db.commit()
    
    return {"message": "University locked successfully"}


@router.get("/locked", response_model=List[UserUniversityResponse])
def get_locked(
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get all locked universities."""
    
    user_unis = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.status == "locked"
    ).all()
    
    return user_unis


@router.post("/unlock/{university_id}")
def unlock_university(
    university_id: str,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Unlock a locked university (WARNING: resets application strategy)."""
    
    # Find locked university
    user_uni = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.university_id == university_id,
        UserUniversity.status == "locked"
    ).first()
    
    if not user_uni:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Locked university not found"
        )
    
    # Update status back to shortlisted
    user_uni.status = "shortlisted"
    db.commit()
    
    return {
        "message": "University unlocked - your application strategy has been reset",
        "warning": "You may need to review your application tasks"
    }


@router.delete("/remove/{university_id}")
def remove_university(
    university_id: str,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Remove a university from shortlist."""
    
    user_uni = db.query(UserUniversity).filter(
        UserUniversity.user_id == current_user.id,
        UserUniversity.university_id == university_id,
        UserUniversity.status == "shortlisted"
    ).first()
    
    if not user_uni:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shortlisted university not found"
        )
    
    db.delete(user_uni)
    db.commit()
    
    return {"message": "University removed from shortlist"}
