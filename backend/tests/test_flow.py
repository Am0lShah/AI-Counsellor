import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
from models.user import User, Onboarding
from models.university import University
from utils.seed_data import seed_universities
import json

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    db = TestingSessionLocal()
    # Add a dummy university manually or call seed
    uni = University(
        name="Test University",
        country="USA", 
        degree_type="masters",
        competitiveness="medium",
        estimated_cost_max=50000,
        field_of_study="Computer Science"
    )
    db.add(uni)
    db.commit()
    
    with TestClient(app) as c:
        yield c
        
    # Cleanup
    Base.metadata.drop_all(bind=engine)

def test_full_user_flow(client):
    # 1. Signup
    print("\n[Test] Signing up user...")
    response = client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    })
    assert response.status_code == 201
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Check Dashboard (Should fail/empty before onboarding or handled gracefully)
    # Our dependency checking requires onboarding for most endpoints, let's verify that.
    print("[Test] Verifying onboarding barrier...")
    response = client.get("/api/dashboard/", headers=headers)
    assert response.status_code == 403 # Expect Forbidden as onboarding is not complete
    
    # 3. Submit Onboarding
    print("[Test] Submitting onboarding data...")
    onboarding_data = {
        "education_level": "Bachelors",
        "degree": "B.Tech",
        "major": "CS",
        "graduation_year": 2024,
        "gpa": 3.8,
        "intended_degree": "masters",
        "field_of_study": "Computer Science",
        "target_intake_year": 2026,
        "preferred_countries": ["USA"],
        "budget_range_min": 10000,
        "budget_range_max": 50000,
        "funding_type": "self_funded",
        "ielts_status": "completed",
        "ielts_score": 7.5,
        "sop_status": "draft"
    }
    response = client.post("/api/onboarding/", json=onboarding_data, headers=headers)
    assert response.status_code == 201
    
    # 4. Check Dashboard (Stage 2: Discovery)
    # GPA 3.8 is strong, so should be able to discover
    print("[Test] Checking Dashboard Stage...")
    response = client.get("/api/dashboard/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["profile_strength"]["academic"] == "strong"
    assert data["stage_info"]["stage_name"] == "University Discovery"
    
    # 5. Get Recommendations
    print("[Test] Fetching recommendations...")
    response = client.get("/api/universities/recommendations", headers=headers)
    assert response.status_code == 200
    unis = response.json()
    assert len(unis) > 0
    target_uni_id = unis[0]["university"]["id"]
    
    # 6. Shortlist University
    print(f"[Test] Shortlisting university {target_uni_id}...")
    response = client.post("/api/universities/shortlist", json={
        "university_id": target_uni_id,
        "category": "dream"
    }, headers=headers)
    assert response.status_code == 201
    
    # 7. Check Dashboard (Stage 3: Finalization)
    print("[Test] Checking Stage Progression to Finalization...")
    response = client.get("/api/dashboard/", headers=headers)
    data = response.json()
    assert data["stage_info"]["stage_name"] == "University Finalization"
    assert data["shortlisted_count"] == 1
    
    # 8. Lock University
    print("[Test] Locking university...")
    response = client.post("/api/universities/lock", json={
        "university_id": target_uni_id
    }, headers=headers)
    assert response.status_code == 200
    
    # 9. Check Dashboard (Stage 4: Application)
    print("[Test] Checking Stage Progression to Application...")
    response = client.get("/api/dashboard/", headers=headers)
    data = response.json()
    assert data["stage_info"]["stage_name"] == "Application Preparation"
    assert data["locked_count"] == 1
    
    print("\n✅ Full user flow verification passed!")

if __name__ == "__main__":
    # Manually run if needed
    pass
