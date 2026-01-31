from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class SignupRequest(BaseModel):
    """Signup request schema."""
    email: EmailStr
    password: str
    full_name: str


class LoginRequest(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """User response schema."""
    id: uuid.UUID
    email: str
    full_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True
