from sqlalchemy import Column, String, Boolean, Integer, DECIMAL, TIMESTAMP, Text, ForeignKey, Date, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


class User(Base):
    """User account model."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    onboarding = relationship("Onboarding", back_populates="user", uselist=False, cascade="all, delete-orphan")
    chat_history = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    todos = relationship("Todo", back_populates="user", cascade="all, delete-orphan")
    user_universities = relationship("UserUniversity", back_populates="user", cascade="all, delete-orphan")


class Onboarding(Base):
    """User onboarding data model."""
    __tablename__ = "onboarding"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Academic Background
    education_level = Column(String(100))
    degree = Column(String(255))
    major = Column(String(255))
    graduation_year = Column(Integer)
    gpa = Column(DECIMAL(3, 2))
    
    # Study Goal
    intended_degree = Column(String(100))
    field_of_study = Column(String(255))
    target_intake_year = Column(Integer)
    preferred_countries = Column(JSON)
    
    # Budget
    budget_range_min = Column(Integer)
    budget_range_max = Column(Integer)
    funding_type = Column(String(50))  # self_funded, loan, scholarship
    
    # Exams & Readiness
    ielts_status = Column(String(50))  # not_started, in_progress, completed
    ielts_score = Column(DECIMAL(2, 1))
    toefl_status = Column(String(50))
    toefl_score = Column(Integer)
    gre_status = Column(String(50))
    gre_score = Column(Integer)
    gmat_status = Column(String(50))
    gmat_score = Column(Integer)
    sop_status = Column(String(50))  # not_started, draft, ready
    
    # Completion
    is_complete = Column(Boolean, default=False)
    completed_at = Column(TIMESTAMP)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="onboarding")


class ChatHistory(Base):
    """AI counsellor chat history model."""
    __tablename__ = "chat_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    role = Column(String(20), nullable=False)  # user, assistant
    message = Column(Text, nullable=False)
    
    # Structured actions (JSON)
    actions = Column(JSON)
    suggested_questions = Column(JSON)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="chat_history")


class Todo(Base):
    """User todo/task model."""
    __tablename__ = "todos"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="SET NULL"))
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(50))  # exam, document, application, other
    priority = Column(String(20))  # high, medium, low
    deadline = Column(Date)
    
    is_complete = Column(Boolean, default=False)
    completed_at = Column(TIMESTAMP)
    
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="todos")
