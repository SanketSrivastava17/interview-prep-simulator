import uuid
import logging
from datetime import datetime
from typing import Dict

logger = logging.getLogger(__name__)

# In-memory session storage (use Redis/DB in production)
sessions: Dict[str, dict] = {}

def generate_session_id() -> str:
    """Generate unique session ID"""
    return str(uuid.uuid4())

def create_session(interview_type: str, role: str, experience_level: str) -> str:
    """Create new interview session"""
    session_id = generate_session_id()
    sessions[session_id] = {
        "session_id": session_id,
        "interview_type": interview_type,
        "role": role,
        "experience_level": experience_level,
        "questions_asked": 0,
        "total_score": 0,
        "scores": [],
        "created_at": datetime.now().isoformat(),
        "history": []
    }
    logger.info(f"Created session: {session_id}")
    return session_id

def get_session(session_id: str) -> dict:
    """Get session data"""
    return sessions.get(session_id)

def update_session_score(session_id: str, score: int, question: str, answer: str):
    """Update session with new Q&A and score"""
    if session_id in sessions:
        session = sessions[session_id]
        session["questions_asked"] += 1
        session["total_score"] += score
        session["scores"].append(score)
        session["history"].append({
            "question": question,
            "answer": answer,
            "score": score,
            "timestamp": datetime.now().isoformat()
        })
        logger.info(f"Session {session_id} updated. Score: {score}")

def get_session_stats(session_id: str) -> dict:
    """Get session statistics"""
    session = sessions.get(session_id)
    if not session:
        return None
    
    questions_asked = session["questions_asked"]
    avg_score = session["total_score"] / questions_asked if questions_asked > 0 else 0
    
    return {
        "session_id": session_id,
        "questions_asked": questions_asked,
        "average_score": round(avg_score, 2),
        "scores": session["scores"],
        "created_at": session["created_at"]
    }

def cleanup_old_sessions(max_age_hours: int = 24):
    """Remove sessions older than max_age_hours"""
    # Simple cleanup - in production use proper job scheduler
    current_time = datetime.now()
    to_remove = []
    
    for session_id, session in sessions.items():
        created_at = datetime.fromisoformat(session["created_at"])
        age_hours = (current_time - created_at).total_seconds() / 3600
        if age_hours > max_age_hours:
            to_remove.append(session_id)
    
    for session_id in to_remove:
        del sessions[session_id]
        logger.info(f"Cleaned up session: {session_id}")
    
    return len(to_remove)
