from database import SessionLocal
from models.university import University
from decimal import Decimal


def seed_universities():
    """Seed dummy university data for testing and demo."""
    
    db = SessionLocal()
    
    # Check if already seeded
    count = db.query(University).count()
    if count > 0:
        print(f"Database already contains {count} universities. Skipping seed.")
        return
    
    universities_data = [
        # USA - Masters in Computer Science
        {
            "name": "Massachusetts Institute of Technology",
            "country": "USA",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 55000,
            "estimated_cost_max": 65000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.8"),
            "min_ielts_required": Decimal("7.5"),
            "min_gre_required": 325,
            "description": "World-renowned tech university with cutting-edge research",
            "ranking": 1
        },
        {
            "name": "Stanford University",
            "country": "USA",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 54000,
            "estimated_cost_max": 64000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.7"),
            "min_ielts_required": Decimal("7.5"),
            "min_gre_required": 325,
            "description": "Silicon Valley's premier research university",
            "ranking": 2
        },
        {
            "name": "University of Texas at Austin",
            "country": "USA",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 35000,
            "estimated_cost_max": 45000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.3"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": 310,
            "description": "Strong CS program with good industry connections",
            "ranking": 42
        },
        {
            "name": "Arizona State University",
            "country": "USA",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 28000,
            "estimated_cost_max": 38000,
            "competitiveness": "low",
            "avg_gpa_required": Decimal("3.0"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": 300,
            "description": "Accessible program with good job placement",
            "ranking": 103
        },
        {
            "name": "University of Southern California",
            "country": "USA",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 50000,
            "estimated_cost_max": 60000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.5"),
            "min_ielts_required": Decimal("7.0"),
            "min_gre_required": 315,
            "description": "Strong connections to LA tech scene",
            "ranking": 23
        },
        
        # UK - Masters in Computer Science
        {
            "name": "University of Oxford",
            "country": "UK",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 40000,
            "estimated_cost_max": 50000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.7"),
            "min_ielts_required": Decimal("7.5"),
            "min_gre_required": None,
            "description": "Historic university with world-class CS research",
            "ranking": 5
        },
        {
            "name": "Imperial College London",
            "country": "UK",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 38000,
            "estimated_cost_max": 48000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.6"),
            "min_ielts_required": Decimal("7.0"),
            "min_gre_required": None,
            "description": "Leading STEM institution in London",
            "ranking": 8
        },
        {
            "name": "University of Edinburgh",
            "country": "UK",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 30000,
            "estimated_cost_max": 40000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.4"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": None,
            "description": "Strong AI and data science programs",
            "ranking": 20
        },
        {
            "name": "University of Manchester",
            "country": "UK",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 28000,
            "estimated_cost_max": 38000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.2"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": None,
            "description": "Birthplace of modern computing",
            "ranking": 27
        },
        
        # Canada - Masters in Computer Science
        {
            "name": "University of Toronto",
            "country": "Canada",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 32000,
            "estimated_cost_max": 42000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.6"),
            "min_ielts_required": Decimal("7.0"),
            "min_gre_required": 315,
            "description": "Canada's top CS program with AI focus",
            "ranking": 18
        },
        {
            "name": "University of British Columbia",
            "country": "Canada",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 28000,
            "estimated_cost_max": 38000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.4"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": 310,
            "description": "Beautiful campus with strong tech connections",
            "ranking": 34
        },
        {
            "name": "University of Waterloo",
            "country": "Canada",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "medium",
            "estimated_cost_min": 25000,
            "estimated_cost_max": 35000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.3"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": 310,
            "description": "Strong co-op program and industry ties",
            "ranking": 45
        },
        
        # Germany - Masters in Computer Science
        {
            "name": "Technical University of Munich",
            "country": "Germany",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "low",
            "estimated_cost_min": 3000,
            "estimated_cost_max": 8000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.5"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": None,
            "description": "Top German tech university with low tuition",
            "ranking": 50
        },
        {
            "name": "RWTH Aachen University",
            "country": "Germany",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "low",
            "estimated_cost_min": 2500,
            "estimated_cost_max": 7500,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.2"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": None,
            "description": "Engineering powerhouse with affordable education",
            "ranking": 106
        },
        
        # Australia - Masters in Computer Science
        {
            "name": "University of Melbourne",
            "country": "Australia",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 38000,
            "estimated_cost_max": 48000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.5"),
            "min_ielts_required": Decimal("7.0"),
            "min_gre_required": None,
            "description": "Australia's leading research university",
            "ranking": 33
        },
        {
            "name": "Australian National University",
            "country": "Australia",
            "degree_type": "masters",
            "field_of_study": "Computer Science",
            "cost_level": "high",
            "estimated_cost_min": 36000,
            "estimated_cost_max": 46000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.3"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": None,
            "description": "Strong CS program in capital city",
            "ranking": 27
        },
        
        # MBA Programs
        {
            "name": "Harvard Business School",
            "country": "USA",
            "degree_type": "mba",
            "field_of_study": "Business Administration",
            "cost_level": "high",
            "estimated_cost_min": 73000,
            "estimated_cost_max": 83000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.7"),
            "min_ielts_required": Decimal("7.5"),
            "min_gre_required": 330,
            "description": "World's premier MBA program",
            "ranking": 1
        },
        {
            "name": "INSEAD",
            "country": "France",
            "degree_type": "mba",
            "field_of_study": "Business Administration",
            "cost_level": "high",
            "estimated_cost_min": 65000,
            "estimated_cost_max": 75000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.5"),
            "min_ielts_required": Decimal("7.0"),
            "min_gre_required": 320,
            "description": "Global MBA with campuses worldwide",
            "ranking": 3
        },
        {
            "name": "IE Business School",
            "country": "Spain",
            "degree_type": "mba",
            "field_of_study": "Business Administration",
            "cost_level": "medium",
            "estimated_cost_min": 55000,
            "estimated_cost_max": 65000,
            "competitiveness": "medium",
            "avg_gpa_required": Decimal("3.3"),
            "min_ielts_required": Decimal("6.5"),
            "min_gre_required": 310,
            "description": "Innovation-focused MBA in Madrid",
            "ranking": 15
        },
        
        # PhD Programs
        {
            "name": "California Institute of Technology",
            "country": "USA",
            "degree_type": "phd",
            "field_of_study": "Computer Science",
            "cost_level": "low",
            "estimated_cost_min": 0,
            "estimated_cost_max": 5000,
            "competitiveness": "high",
            "avg_gpa_required": Decimal("3.8"),
            "min_ielts_required": Decimal("7.5"),
            "min_gre_required": 330,
            "description": "Fully funded PhD with stipend",
            "ranking": 4
        }
    ]
    
    # Add universities to database
    for uni_data in universities_data:
        university = University(**uni_data)
        db.add(university)
    
    db.commit()
    print(f"✅ Seeded {len(universities_data)} universities")
    
    db.close()


if __name__ == "__main__":
    print("Starting university data seed...")
    seed_universities()
    print("Seed complete!")
