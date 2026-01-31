from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User, ChatHistory
from schemas.ai import ChatRequest, ChatResponse, ChatHistoryResponse
from services.ai_service import AICounsellorService
from utils.dependencies import require_onboarding_complete
from config import settings

router = APIRouter(prefix="/counsellor", tags=["AI Counsellor"])


@router.get("/health")
def health_check():
    """Check AI service health and configuration."""
    return {
        "ai_service": settings.ai_service,
        "gemini_key_configured": bool(settings.gemini_api_key),
        "openai_key_configured": bool(settings.openai_api_key),
        "status": "healthy"
    }


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Chat with AI Counsellor and get actionable responses."""
    try:
        onboarding = current_user.onboarding
    
        # Initialize AI service
        ai_service = AICounsellorService(db)
        
        # Get AI response
        response = await ai_service.get_ai_response(
            str(current_user.id),
            request.message,
            onboarding
        )
        
        # Save user message
        user_msg = ChatHistory(
            user_id=current_user.id,
            role="user",
            message=request.message
        )
        db.add(user_msg)
        
        # Save assistant response
        assistant_msg = ChatHistory(
            user_id=current_user.id,
            role="assistant",
            message=response["message"],
            actions=response.get("actions"),
            suggested_questions=response.get("suggested_questions")
        )
        db.add(assistant_msg)
        db.commit()
        
        # Execute actions if present
        if response.get("actions"):
            ai_service.execute_actions(str(current_user.id), response["actions"])
        
        return ChatResponse(
            message=response["message"],
            actions=response.get("actions"),
            suggested_questions=response.get("suggested_questions")
        )
    except Exception as e:
        import traceback
        with open("error.log", "w") as f:
            f.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=List[ChatHistoryResponse])
def get_chat_history(
    limit: int = 50,
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Get chat history with AI Counsellor."""
    try:
        history = db.query(ChatHistory).filter(
            ChatHistory.user_id == current_user.id
        ).order_by(ChatHistory.created_at.desc()).limit(limit).all()
        
        return list(reversed(history))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/history")
def clear_chat_history(
    current_user: User = Depends(require_onboarding_complete),
    db: Session = Depends(get_db)
):
    """Clear chat history."""
    
    db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).delete()
    
    db.commit()
    
    return {"message": "Chat history cleared"}
