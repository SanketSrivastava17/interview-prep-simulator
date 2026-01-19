from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import os
from dotenv import load_dotenv

from models import (
    StartInterviewRequest,
    SubmitAnswerRequest,
    QuestionResponse,
    AnswerFeedback,
    HealthResponse,
    ErrorResponse,
    GetNextQuestionRequest
)
from agent import (
    generate_interview_question,
    evaluate_answer,
    check_agent_health
)
from utils import (
    create_session,
    get_session,
    update_session_score,
    get_session_stats,
    cleanup_old_sessions
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Interview Prep Simulator API")
    logger.info(f"Agent health: {check_agent_health()}")
    yield
    # Shutdown
    logger.info("👋 Shutting down API")
    cleanup_old_sessions()

# Initialize FastAPI app
app = FastAPI(
    title="Interview Prep Simulator API",
    description="AI-powered interview practice with real-time feedback",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration - Allow all origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            detail=str(exc)
        ).model_dump()
    )

# Health check endpoint
@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="Interview Prep Simulator API",
        version="1.0.0",
        agent_ready=check_agent_health()
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    agent_ready = check_agent_health()
    return HealthResponse(
        status="healthy" if agent_ready else "degraded",
        service="Interview Prep Simulator API",
        version="1.0.0",
        agent_ready=agent_ready
    )

# Start interview session
@app.post("/api/interview/start", response_model=QuestionResponse)
async def start_interview(request: StartInterviewRequest):
    """
    Start a new interview session and get the first question
    
    - Validates interview type, role, and experience level
    - Creates session ID for tracking
    - Generates contextually relevant first question using AI
    """
    try:
        logger.info(f"Starting {request.interview_type} interview for {request.role}")
        
        # Create session
        session_id = create_session(
            interview_type=request.interview_type.value,
            role=request.role,
            experience_level=request.experience_level.value
        )
        
        # Generate first question
        question = await generate_interview_question(
            interview_type=request.interview_type,
            role=request.role,
            experience_level=request.experience_level,
            domain=request.domain,
            session_id=session_id
        )
        
        logger.info(f"Session {session_id} started successfully")
        return question
        
    except Exception as e:
        logger.error(f"Error starting interview: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start interview: {str(e)}"
        )

# Submit answer and get feedback
@app.post("/api/interview/answer", response_model=AnswerFeedback)
async def submit_answer(request: SubmitAnswerRequest):
    """
    Submit answer for evaluation
    
    - Validates session exists
    - Uses AI to evaluate answer quality
    - Returns detailed feedback with scores
    - Updates session statistics
    """
    try:
        logger.info(f"Processing answer for session {request.session_id}")
        
        # Verify session exists
        session = get_session(request.session_id)
        if not session:
            raise HTTPException(
                status_code=404,
                detail="Session not found. Please start a new interview."
            )
        
        # Evaluate answer using AI
        feedback = await evaluate_answer(
            question=request.question,
            answer=request.answer,
            expected_topics=[],  # Could extract from session history
            interview_type=session["interview_type"]
        )
        
        # Update session stats
        update_session_score(
            session_id=request.session_id,
            score=feedback.overall_score,
            question=request.question,
            answer=request.answer
        )
        
        logger.info(f"Answer evaluated. Score: {feedback.overall_score}")
        return feedback
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error evaluating answer: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to evaluate answer: {str(e)}"
        )

# Get next question
@app.post("/api/interview/next", response_model=QuestionResponse)
async def get_next_question(request: GetNextQuestionRequest):
    """
    Get next interview question
    
    - Adjusts difficulty based on previous performance
    - Maintains conversation flow
    """
    try:
        logger.info(f"Getting next question for session {request.session_id}")
        
        # Verify session
        session = get_session(request.session_id)
        if not session:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )
        
        # Generate next question
        question = await generate_interview_question(
            interview_type=session["interview_type"],
            role=session["role"],
            experience_level=session["experience_level"],
            domain=None,
            session_id=request.session_id,
            previous_score=request.previous_score
        )
        
        return question
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting next question: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get next question: {str(e)}"
        )

# Get session statistics
@app.get("/api/interview/stats/{session_id}")
async def get_stats(session_id: str):
    """Get session statistics and progress"""
    try:
        stats = get_session_stats(session_id)
        if not stats:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )
        return stats
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get statistics: {str(e)}"
        )

# Run server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
