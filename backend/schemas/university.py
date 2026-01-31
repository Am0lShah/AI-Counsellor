from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
import uuid


class UniversityResponse(BaseModel):
    """University response schema."""
    id: uuid.UUID
    name: str
    country: str
    degree_type: str
    field_of_study: Optional[str] = None
    
    # Cost & Competitiveness
    cost_level: Optional[str] = None
    estimated_cost_min: Optional[int] = None
    estimated_cost_max: Optional[int] = None
    
    # Admission Info
    competitiveness: Optional[str] = None
    avg_gpa_required: Optional[Decimal] = None
    min_ielts_required: Optional[Decimal] = None
    min_toefl_required: Optional[int] = None
    min_gre_required: Optional[int] = None
    
    # Additional Info
    description: Optional[str] = None
    website: Optional[str] = None
    ranking: Optional[int] = None
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUniversityResponse(BaseModel):
    """User university (shortlisted/locked) response schema."""
    id: uuid.UUID
    user_id: uuid.UUID
    university_id: uuid.UUID
    
    status: str  # shortlisted, locked
    category: Optional[str] = None  # dream, target, safe
    
    # AI Analysis
    acceptance_likelihood: Optional[str] = None
    fit_reason: Optional[str] = None
    risk_factors: Optional[str] = None
    
    created_at: datetime
    updated_at: datetime
    
    # Include university details
    university: UniversityResponse
    
    class Config:
        from_attributes = True


class ShortlistRequest(BaseModel):
    """Shortlist university request schema."""
    university_id: uuid.UUID
    category: str  # dream, target, safe


class LockRequest(BaseModel):
    """Lock university request schema."""
    university_id: uuid.UUID
