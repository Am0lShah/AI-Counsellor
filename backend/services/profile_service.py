from typing import Dict, Any
from decimal import Decimal
from models.user import Onboarding
from models.university import UserUniversity


def calculate_profile_strength(onboarding: Onboarding) -> Dict[str, Any]:
    """
    Calculate profile strength based on onboarding data.
    Returns academic, exams, sop status and overall score.
    """
    
    # Academic strength
    academic_strength = "average"
    if onboarding.gpa:
        if onboarding.gpa >= Decimal("3.5"):
            academic_strength = "strong"
        elif onboarding.gpa < Decimal("2.5"):
            academic_strength = "weak"
    
    # Exams readiness
    exams_status = "not_started"
    completed_count = 0
    total_relevant = 0
    
    # Check language test
    if onboarding.ielts_status or onboarding.toefl_status:
        total_relevant += 1
        if onboarding.ielts_status == "completed" or onboarding.toefl_status == "completed":
            completed_count += 1
    
    # Check aptitude test (for masters/phd)
    if onboarding.intended_degree in ["masters", "phd"]:
        if onboarding.gre_status or onboarding.gmat_status:
            total_relevant += 1
            if onboarding.gre_status == "completed" or onboarding.gmat_status == "completed":
                completed_count += 1
    
    if total_relevant > 0:
        if completed_count == total_relevant:
            exams_status = "completed"
        elif completed_count > 0:
            exams_status = "in_progress"
    
    # SOP status
    sop_status = onboarding.sop_status or "not_started"
    
    # Calculate overall score (0-100)
    score = 0
    
    # Academic contribution (40%)
    if academic_strength == "strong":
        score += 40
    elif academic_strength == "average":
        score += 25
    else:
        score += 10
    
    # Exams contribution (40%)
    if exams_status == "completed":
        score += 40
    elif exams_status == "in_progress":
        score += 20
    
    # SOP contribution (20%)
    if sop_status == "ready":
        score += 20
    elif sop_status == "draft":
        score += 10
    
    return {
        "academic": academic_strength,
        "exams": exams_status,
        "sop": sop_status,
        "overall_score": score
    }


def determine_stage(
    onboarding: Onboarding,
    shortlisted_count: int,
    locked_count: int
) -> Dict[str, Any]:
    """
    Determine current stage based on user progress.
    Stage 1: Profile Building
    Stage 2: University Discovery
    Stage 3: University Finalization
    Stage 4: Application Preparation
    """
    
    # Stage 4: Application Preparation (locked universities)
    if locked_count > 0:
        return {
            "current_stage": 4,
            "stage_name": "Application Preparation",
            "stage_description": "Prepare your applications and complete required documents",
            "is_locked": False,
            "next_action": "Work on your application tasks and deadlines"
        }
    
    # Stage 3: University Finalization (shortlisted but not locked)
    if shortlisted_count > 0:
        return {
            "current_stage": 3,
            "stage_name": "University Finalization",
            "stage_description": "Lock your final university choices",
            "is_locked": False,
            "next_action": "Lock at least one university to proceed"
        }
    
    # Stage 2: University Discovery (profile strong enough)
    profile_strength = calculate_profile_strength(onboarding)
    if profile_strength["overall_score"] >= 30:  # Basic threshold
        return {
            "current_stage": 2,
            "stage_name": "University Discovery",
            "stage_description": "Explore and shortlist universities",
            "is_locked": False,
            "next_action": "Talk to AI Counsellor to discover universities"
        }
    
    # Stage 1: Profile Building (default)
    return {
        "current_stage": 1,
        "stage_name": "Profile Building",
        "stage_description": "Strengthen your profile with exams and SOP",
        "is_locked": False,
        "next_action": "Complete exams and prepare your SOP"
    }
