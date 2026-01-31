from typing import List, Dict, Any, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session
from models.user import Onboarding
from models.university import University, UserUniversity


def calculate_acceptance_likelihood(
    user_profile: Onboarding,
    university: University
) -> str:
    """
    Calculate acceptance likelihood based on user profile vs university requirements.
    Returns: 'low', 'medium', or 'high'
    """
    
    score = 0
    max_score = 0
    
    # GPA comparison (weight: 40%)
    if university.avg_gpa_required and user_profile.gpa:
        max_score += 40
        gpa_diff = float(user_profile.gpa) - float(university.avg_gpa_required)
        
        if gpa_diff >= 0.3:
            score += 40  # Well above
        elif gpa_diff >= 0:
            score += 30  # Meets
        elif gpa_diff >= -0.2:
            score += 15  # Slightly below
        else:
            score += 5   # Significantly below
    
    # IELTS comparison (weight: 30%)
    if university.min_ielts_required and user_profile.ielts_score:
        max_score += 30
        ielts_diff = float(user_profile.ielts_score) - float(university.min_ielts_required)
        
        if ielts_diff >= 1:
            score += 30
        elif ielts_diff >= 0:
            score += 25
        elif ielts_diff >= -0.5:
            score += 10
        else:
            score += 0
    
    # GRE comparison (weight: 30%)
    if university.min_gre_required and user_profile.gre_score:
        max_score += 30
        gre_diff = user_profile.gre_score - university.min_gre_required
        
        if gre_diff >= 20:
            score += 30
        elif gre_diff >= 0:
            score += 25
        elif gre_diff >= -10:
            score += 10
        else:
            score += 0
    
    # If no criteria matched, use competitiveness
    if max_score == 0:
        if university.competitiveness == "low":
            return "high"
        elif university.competitiveness == "medium":
            return "medium"
        else:
            return "low"
    
    # Calculate percentage
    percentage = (score / max_score) * 100
    
    if percentage >= 75:
        return "high"
    elif percentage >= 50:
        return "medium"
    else:
        return "low"


def categorize_university(
    user_profile: Onboarding,
    university: University
) -> Tuple[str, str]:
    """
    Categorize university as Dream, Target, or Safe.
    Returns: (category, acceptance_likelihood)
    """
    
    acceptance = calculate_acceptance_likelihood(user_profile, university)
    
    # Consider competitiveness and acceptance
    if university.competitiveness == "high" or acceptance == "low":
        category = "dream"
    elif university.competitiveness == "low" or acceptance == "high":
        category = "safe"
    else:
        category = "target"
    
    return category, acceptance


def generate_fit_analysis(
    user_profile: Onboarding,
    university: University,
    category: str,
    acceptance: str
) -> Dict[str, str]:
    """
    Generate fit reason and risk factors for a university.
    """
    
    fit_reasons = []
    risk_factors = []
    
    # Field match
    if user_profile.field_of_study.lower() in (university.field_of_study or "").lower():
        fit_reasons.append(f"Matches your field of study: {user_profile.field_of_study}")
    
    # Country preference
    if university.country in user_profile.preferred_countries:
        fit_reasons.append(f"Located in your preferred country: {university.country}")
    
    # Degree match
    if user_profile.intended_degree == university.degree_type:
        fit_reasons.append(f"Offers {university.degree_type} programs")
    
    # Budget analysis
    if university.estimated_cost_max:
        if university.estimated_cost_max <= user_profile.budget_range_max:
            fit_reasons.append("Within your budget range")
        else:
            risk_factors.append(f"Cost may exceed budget (${university.estimated_cost_max:,}/year)")
    
    # GPA analysis
    if university.avg_gpa_required and user_profile.gpa:
        gpa_diff = float(user_profile.gpa) - float(university.avg_gpa_required)
        if gpa_diff < -0.2:
            risk_factors.append(f"Your GPA ({user_profile.gpa}) is below average requirement ({university.avg_gpa_required})")
    
    # Test score analysis
    if university.min_ielts_required and user_profile.ielts_score:
        if user_profile.ielts_score < university.min_ielts_required:
            risk_factors.append(f"IELTS score below requirement ({user_profile.ielts_score} < {university.min_ielts_required})")
    
    # Competitiveness
    if university.competitiveness == "high":
        risk_factors.append("Highly competitive program with low acceptance rate")
    
    # Default messages
    if not fit_reasons:
        fit_reasons.append("General alignment with your profile")
    
    if not risk_factors:
        risk_factors.append("No significant risks identified")
    
    return {
        "fit_reason": "; ".join(fit_reasons),
        "risk_factors": "; ".join(risk_factors)
    }


def recommend_universities(
    db: Session,
    user_profile: Onboarding,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """
    Recommend universities based on user profile.
    Returns list of universities with categorization and analysis.
    """
    
    # Query universities matching user preferences
    query = db.query(University).filter(
        University.degree_type == user_profile.intended_degree
    )
    
    # Filter by country preference
    if user_profile.preferred_countries:
        query = query.filter(University.country.in_(user_profile.preferred_countries))
    
    # Filter by field (if specified)
    if user_profile.field_of_study:
        query = query.filter(University.field_of_study.ilike(f"%{user_profile.field_of_study}%"))
    
    universities = query.limit(limit).all()
    
    recommendations = []
    for uni in universities:
        category, acceptance = categorize_university(user_profile, uni)
        analysis = generate_fit_analysis(user_profile, uni, category, acceptance)
        
        recommendations.append({
            "university": uni,
            "category": category,
            "acceptance_likelihood": acceptance,
            "fit_reason": analysis["fit_reason"],
            "risk_factors": analysis["risk_factors"]
        })
    
    # Sort by category priority (safe, target, dream)
    category_order = {"safe": 1, "target": 2, "dream": 3}
    recommendations.sort(key=lambda x: category_order.get(x["category"], 99))
    
    return recommendations
