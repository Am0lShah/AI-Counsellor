from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models.user import User, Todo
from utils.dependencies import require_onboarding_complete
from pydantic import BaseModel
from datetime import date
import uuid

router = APIRouter(prefix="/todos", tags=["Todos"])


class TodoCreate(BaseModel):
    """Todo creation request."""
    title: str
    description: str = None
    category: str  # exam, document, application, other
    priority: str = "medium"  # high, medium, low
    deadline: date = None


class TodoUpdate(BaseModel):
    """Todo update request."""
    title: str = None
    description: str = None
    category: str = None
    priority: str = None
    deadline: date = None
    is_complete: bool = None


class TodoResponse(BaseModel):
    """Todo response."""
    id: uuid.UUID
    title: str
    description: str = None
    category: str
    priority: str
    deadline: date = None
    is_complete: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    request: TodoCreate,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Create a new todo."""
    
    todo = Todo(
        user_id=current_user.id,
        **request.dict()
    )
    
    db.add(todo)
    db.commit()
    db.refresh(todo)
    
    return todo


@router.get("/", response_model=List[TodoResponse])
def get_todos(
    completed: bool = None,
    category: str = None,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get all todos with optional filters."""
    
    query = db.query(Todo).filter(Todo.user_id == current_user.id)
    
    if completed is not None:
        query = query.filter(Todo.is_complete == completed)
    
    if category:
        query = query.filter(Todo.category == category)
    
    todos = query.order_by(
        Todo.is_complete.asc(),
        Todo.priority.desc(),
        Todo.created_at.desc()
    ).all()
    
    return todos


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get a specific todo."""
    
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    return todo


@router.patch("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: uuid.UUID,
    request: TodoUpdate,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Update a todo."""
    
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    # Update fields
    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)
    
    # Set completed_at if marking complete
    if request.is_complete and not todo.completed_at:
        todo.completed_at = datetime.utcnow()
    elif request.is_complete == False:
        todo.completed_at = None
    
    db.commit()
    db.refresh(todo)
    
    return todo


@router.post("/{todo_id}/complete", response_model=TodoResponse)
def complete_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Mark a todo as complete."""
    
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    todo.is_complete = True
    todo.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(todo)
    
    return todo


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: uuid.UUID,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Delete a todo."""
    
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    
    db.delete(todo)
    db.commit()
    
    return {"message": "Todo deleted successfully"}
