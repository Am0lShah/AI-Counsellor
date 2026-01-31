from sqlalchemy import Column, String, Integer, DECIMAL, TIMESTAMP, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


class University(Base):
    """University model."""
    __tablename__ = "universities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    degree_type = Column(String(100), nullable=False)  # bachelors, masters, mba, phd
    field_of_study = Column(String(255))
    
    # Cost & Competitiveness
    cost_level = Column(String(20))  # low, medium, high
    estimated_cost_min = Column(Integer)
    estimated_cost_max = Column(Integer)
    
    # Admission Info
    competitiveness = Column(String(20))  # low, medium, high
    avg_gpa_required = Column(DECIMAL(3, 2))
    min_ielts_required = Column(DECIMAL(2, 1))
    min_toefl_required = Column(Integer)
    min_gre_required = Column(Integer)
    
    # Additional Info
    description = Column(Text)
    website = Column(String(255))
    ranking = Column(Integer)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    user_universities = relationship("UserUniversity", back_populates="university", cascade="all, delete-orphan")


class UserUniversity(Base):
    """User's shortlisted/locked universities with AI analysis."""
    __tablename__ = "user_universities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String(20), nullable=False)  # shortlisted, locked
    category = Column(String(20))  # dream, target, safe
    
    # AI Analysis
    acceptance_likelihood = Column(String(20))  # low, medium, high
    fit_reason = Column(Text)
    risk_factors = Column(Text)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_universities")
    university = relationship("University", back_populates="user_universities")
