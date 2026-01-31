from typing import Dict, Any, List, Optional
import json
import re
from sqlalchemy.orm import Session
from models.user import Onboarding, ChatHistory, Todo
from models.university import UserUniversity, University
from services.profile_service import calculate_profile_strength, determine_stage
from services.recommendation_service import recommend_universities
from config import settings


class AICounsellorService:
    """AI Counsellor service for intelligent conversation and action execution."""
    
    def __init__(self, db: Session):
        self.db = db
        self.ai_service = settings.ai_service
        
        # Initialize AI client
        if self.ai_service == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')
        elif self.ai_service == "openai":
            from openai import OpenAI
            self.client = OpenAI(api_key=settings.openai_api_key)
    
    def build_context(
        self,
        user_id: str,
        onboarding: Onboarding
    ) -> str:
        """Build comprehensive context for AI about the user."""
        
        # Get current stage
        shortlisted = self.db.query(UserUniversity).filter(
            UserUniversity.user_id == user_id,
            UserUniversity.status == "shortlisted"
        ).count()
        
        locked = self.db.query(UserUniversity).filter(
            UserUniversity.user_id == user_id,
            UserUniversity.status == "locked"
        ).count()
        
        stage_info = determine_stage(onboarding, shortlisted, locked)
        profile_strength = calculate_profile_strength(onboarding)
        
        # Get shortlisted universities
        shortlisted_unis = self.db.query(UserUniversity).filter(
            UserUniversity.user_id == user_id,
            UserUniversity.status == "shortlisted"
        ).all()
        
        # Get locked universities
        locked_unis = self.db.query(UserUniversity).filter(
            UserUniversity.user_id == user_id,
            UserUniversity.status == "locked"
        ).all()
        
        # Build context string
        context = f"""You are an expert study-abroad counsellor helping a student plan their journey.

STUDENT PROFILE:
- Name: {onboarding.user.full_name}
- Education: {onboarding.education_level} in {onboarding.major}
- GPA: {onboarding.gpa if onboarding.gpa else 'Not provided'}
- Graduation Year: {onboarding.graduation_year}

STUDY GOALS:
- Intended Degree: {onboarding.intended_degree}
- Field of Study: {onboarding.field_of_study}
- Target Intake: {onboarding.target_intake_year}
- Preferred Countries: {', '.join(onboarding.preferred_countries)}

BUDGET:
- Range: ${onboarding.budget_range_min:,} - ${onboarding.budget_range_max:,} per year
- Funding Type: {onboarding.funding_type}

EXAM STATUS:
- IELTS: {onboarding.ielts_status} {f'(Score: {onboarding.ielts_score})' if onboarding.ielts_score else ''}
- TOEFL: {onboarding.toefl_status or 'Not applicable'} {f'(Score: {onboarding.toefl_score})' if onboarding.toefl_score else ''}
- GRE: {onboarding.gre_status or 'Not applicable'} {f'(Score: {onboarding.gre_score})' if onboarding.gre_score else ''}
- GMAT: {onboarding.gmat_status or 'Not applicable'} {f'(Score: {onboarding.gmat_score})' if onboarding.gmat_score else ''}

SOP STATUS: {onboarding.sop_status}

PROFILE STRENGTH:
- Academic: {profile_strength['academic']}
- Exams: {profile_strength['exams']}
- SOP: {profile_strength['sop']}
- Overall Score: {profile_strength['overall_score']}/100

CURRENT STAGE: Stage {stage_info['current_stage']} - {stage_info['stage_name']}
{stage_info['stage_description']}

SHORTLISTED UNIVERSITIES ({len(shortlisted_unis)}):
{self._format_university_list(shortlisted_unis)}

LOCKED UNIVERSITIES ({len(locked_unis)}):
{self._format_university_list(locked_unis)}

YOUR ROLE:
1. Provide personalized, actionable advice based on current stage
2. Recommend universities that fit the student's profile
3. Explain WHY universities fit (or don't fit)
4. Help shortlist and lock universities
5. Create relevant tasks and to-dos
6. Guide through each stage systematically

STAGE-SPECIFIC GUIDANCE:
- Stage 1 (Profile Building): Focus on improving test scores, GPA, and SOP
- Stage 2 (University Discovery): Recommend and explain universities (Dream/Target/Safe)
- Stage 3 (University Finalization): Help lock universities, explain commitment
- Stage 4 (Application Preparation): Create application tasks, deadlines, document checklists

IMPORTANT RULES:
- Always consider the student's budget and funding constraints
- Categorize universities as Dream (reach), Target (match), or Safe (likely)
- Provide specific, actionable next steps
- Be encouraging but realistic
- Never recommend universities outside their budget or field
- Always explain your reasoning

RESPONSE STYLE & TONE:
- Be concise and to the point (max 3-4 sentences per response unless detailed info is requested)
- Use a natural, conversational, and "human-like" tone
- Avoid robotic or overly formal language
- Focus on the most important next step rather than overwhelming with information

When you want to take actions (shortlist university, lock university, create todo), include them in a structured JSON format at the end of your response wrapped in [ACTIONS]...[/ACTIONS] tags.

Action format:
[ACTIONS]
{{
  "actions": [
    {{"type": "shortlist_university", "university_id": "uuid", "category": "dream|target|safe"}},
    {{"type": "lock_university", "university_id": "uuid"}},
    {{"type": "create_todo", "title": "Task title", "description": "Details", "category": "exam|document|application|other", "priority": "high|medium|low"}}
  ]
}}
[/ACTIONS]
"""
        
        return context
    
    def _format_university_list(self, user_unis: List[UserUniversity]) -> str:
        """Format university list for context."""
        if not user_unis:
            return "None"
        
        lines = []
        for uu in user_unis:
            uni = uu.university
            lines.append(
                f"- {uni.name} ({uni.country}) - {uu.category.upper()} | "
                f"Acceptance: {uu.acceptance_likelihood} | "
                f"Fit: {uu.fit_reason}"
            )
        
        return "\n".join(lines)
    
    async def get_ai_response(
        self,
        user_id: str,
        message: str,
        onboarding: Onboarding
    ) -> Dict[str, Any]:
        """
        Get AI response for user message.
        Returns: {message: str, actions: List[Dict]}
        """
        
        # Build context
        context = self.build_context(user_id, onboarding)
        
        # Get chat history (last 5 messages for context)
        history = self.db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id
        ).order_by(ChatHistory.created_at.desc()).limit(5).all()
        
        # Build conversation
        conversation = []
        for msg in reversed(history):
            conversation.append(f"{msg.role.upper()}: {msg.message}")
        
        conversation.append(f"USER: {message}")
        
        full_prompt = f"{context}\n\nCONVERSATION HISTORY:\n" + "\n".join(conversation)
        
        # Get AI response
        try:
            if self.ai_service == "gemini":
                response = self.model.generate_content(full_prompt)
                ai_message = response.text
            else:  # openai
                response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": context},
                        {"role": "user", "content": message}
                    ]
                )
                ai_message = response.choices[0].message.content
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            return {
                "message": "I apologize, but I am currently experiencing high traffic or quota limits. Please try again in a minute.",
                "actions": []
            }
        
        # Extract data (actions + suggestions)
        data = self._extract_data(ai_message)
        actions = []
        suggestions = []
        
        if data:
            actions = data.get("actions", [])
            suggestions = data.get("suggestions", [])
        
        # Clean message (remove data tags)
        clean_message = re.sub(r'\[DATA\].*?\[/DATA\]', '', ai_message, flags=re.DOTALL)
        clean_message = re.sub(r'\[ACTIONS\].*?\[/ACTIONS\]', '', clean_message, flags=re.DOTALL).strip()
        
        return {
            "message": clean_message,
            "actions": actions,
            "suggested_questions": suggestions
        }
    
    def _extract_data(self, message: str) -> Optional[Dict[str, Any]]:
        """Extract structured data from AI message (supports [DATA] and [ACTIONS])."""
        
        # Try [DATA] first
        match = re.search(r'\[DATA\](.*?)\[/DATA\]', message, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except:
                pass
                
        # Fallback to [ACTIONS]
        match = re.search(r'\[ACTIONS\](.*?)\[/ACTIONS\]', message, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(1).strip())
                # If it's the old format {"actions": []}, wrap/return as is
                return data
            except:
                pass
                
        return None


    
    def execute_actions(
        self,
        user_id: str,
        actions: List[Dict[str, Any]]
    ) -> List[str]:
        """
        Execute actions from AI response.
        Returns list of execution results.
        """
        
        results = []
        
        for action in actions:
            action_type = action.get("type")
            
            try:
                if action_type == "shortlist_university":
                    uid = action.get("university_id")
                    if not self._is_valid_uuid(uid):
                        results.append(f"Error: Invalid university ID received ({uid})")
                        continue
                        
                    result = self._shortlist_university(
                        user_id,
                        uid,
                        action.get("category", "target")
                    )
                    results.append(result)
                
                elif action_type == "lock_university":
                    uid = action.get("university_id")
                    if not self._is_valid_uuid(uid):
                        results.append(f"Error: Invalid university ID received ({uid})")
                        continue

                    result = self._lock_university(
                        user_id,
                        uid
                    )
                    results.append(result)
                
                elif action_type == "create_todo":
                    result = self._create_todo(
                        user_id,
                        action.get("title"),
                        action.get("description"),
                        action.get("category", "other"),
                        action.get("priority", "medium")
                    )
                    results.append(result)
            except Exception as e:
                print(f"Action Execution Error: {str(e)}")
                results.append(f"Failed to execute action {action_type}")
        
        try:
            self.db.commit()
        except Exception as e:
            print(f"DB Commit Error: {str(e)}")
            self.db.rollback()
            results.append("Database error during commit")
            
        return results

    def _is_valid_uuid(self, val):
        import uuid
        try:
            uuid.UUID(str(val))
            return True
        except ValueError:
            return False
    
    def _shortlist_university(
        self,
        user_id: str,
        university_id: str,
        category: str
    ) -> str:
        """Shortlist a university."""
        
        # Check if already exists
        existing = self.db.query(UserUniversity).filter(
            UserUniversity.user_id == user_id,
            UserUniversity.university_id == university_id
        ).first()
        
        if existing:
            return f"University already in your list"
        
        # Get university
        university = self.db.query(University).filter(
            University.id == university_id
        ).first()
        
        if not university:
            return "University not found"
        
        # Get user onboarding
        onboarding = self.db.query(Onboarding).filter(
            Onboarding.user_id == user_id
        ).first()
        
        # Calculate acceptance and fit
        from services.recommendation_service import categorize_university, generate_fit_analysis
        calc_category, acceptance = categorize_university(onboarding, university)
        analysis = generate_fit_analysis(onboarding, university, calc_category, acceptance)
        
        # Create user university
        user_uni = UserUniversity(
            user_id=user_id,
            university_id=university_id,
            status="shortlisted",
            category=category,
            acceptance_likelihood=acceptance,
            fit_reason=analysis["fit_reason"],
            risk_factors=analysis["risk_factors"]
        )
        
        self.db.add(user_uni)
        
        return f"Shortlisted {university.name}"
    
    def _lock_university(
        self,
        user_id: str,
        university_id: str
    ) -> str:
        """Lock a university."""
        
        # Find in shortlisted
        user_uni = self.db.query(UserUniversity).filter(
            UserUniversity.user_id == user_id,
            UserUniversity.university_id == university_id,
            UserUniversity.status == "shortlisted"
        ).first()
        
        if not user_uni:
            return "University must be shortlisted first"
        
        # Update status
        user_uni.status = "locked"
        
        return f"Locked {user_uni.university.name}"
    
    def _create_todo(
        self,
        user_id: str,
        title: str,
        description: str,
        category: str,
        priority: str
    ) -> str:
        """Create a todo."""
        
        todo = Todo(
            user_id=user_id,
            title=title,
            description=description,
            category=category,
            priority=priority
        )
        
        self.db.add(todo)
        
        return f"Created task: {title}"
