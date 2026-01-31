from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import uuid


class OnboardingRequest(BaseModel):
    """Onboarding data submission schema."""
    # Academic Background
    education_level: str
    degree: str
    major: str
    graduation_year: int
    gpa: Optional[Decimal] = None
    
    # Study Goal
    intended_degree: str
    field_of_study: str
    target_intake_year: int
    preferred_countries: List[str]
    
    # Budget
    budget_range_min: int
    budget_range_max: int
    funding_type: str  # self_funded, loan, scholarship
    
    # Exams & Readiness
    ielts_status: str  # not_started, in_progress, completed
    ielts_score: Optional[Decimal] = None
    toefl_status: Optional[str] = None
    toefl_score: Optional[int] = None
    gre_status: Optional[str] = None
    gre_score: Optional[int] = None
    gmat_status: Optional[str] = None
    gmat_score: Optional[int] = None
    sop_status: str  # not_started, draft, ready


class OnboardingResponse(BaseModel):
    """Onboarding data response schema."""
    id: uuid.UUID
    user_id: uuid.UUID
    
    # Academic Background
    education_level: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[Decimal] = None
    
    # Study Goal
    intended_degree: Optional[str] = None
    field_of_study: Optional[str] = None
    target_intake_year: Optional[int] = None
    preferred_countries: Optional[List[str]] = None
    
    # Budget
    budget_range_min: Optional[int] = None
    budget_range_max: Optional[int] = None
    funding_type: Optional[str] = None
    
    # Exams & Readiness
    ielts_status: Optional[str] = None
    ielts_score: Optional[Decimal] = None
    toefl_status: Optional[str] = None
    toefl_score: Optional[int] = None
    gre_status: Optional[str] = None
    gre_score: Optional[int] = None
    gmat_status: Optional[str] = None
    gmat_score: Optional[int] = None
    sop_status: Optional[str] = None
    
    # Completion
    is_complete: bool
    completed_at: Optional[datetime] = None
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
