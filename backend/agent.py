import os
import logging
from typing import Optional
from dotenv import load_dotenv
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel

# Load environment variables
load_dotenv()
from models import (
    QuestionResponse,
    AnswerFeedback,
    FeedbackDetail,
    InterviewType,
    ExperienceLevel,
    DifficultyLevel
)

logger = logging.getLogger(__name__)

# Configure OpenRouter model (free tier)
def get_model():
    """Get configured LLM model from OpenRouter"""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment")
    
    # Using a free model from OpenRouter
    # Options: google/gemma-2-9b-it:free, meta-llama/llama-3-8b-instruct:free
    model = OpenAIModel(
        "google/gemma-2-9b-it:free",
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    return model

# Agent Dependencies (context passed to agent)
class InterviewContext:
    """Context for interview session"""
    def __init__(
        self,
        interview_type: InterviewType,
        role: str,
        experience_level: ExperienceLevel,
        domain: Optional[str] = None
    ):
        self.interview_type = interview_type
        self.role = role
        self.experience_level = experience_level
        self.domain = domain

# Question Generator Agent
question_agent = Agent(
    model=get_model(),
    result_type=QuestionResponse,
    system_prompt="""You are an expert technical interviewer with 15+ years of experience.
    Your job is to generate thoughtful, relevant interview questions that:
    1. Match the candidate's experience level
    2. Are specific to the role and domain
    3. Test both theoretical knowledge and practical application
    4. Are clear and unambiguous
    5. Have measurable evaluation criteria
    
    For technical interviews: Focus on algorithms, system design, coding, problem-solving
    For behavioral interviews: Focus on past experiences, teamwork, conflict resolution
    For HR interviews: Focus on career goals, company fit, motivations
    
    Generate ONE question at a time with clear context and expected topics to cover.
    """,
    retries=2,
)

# Feedback Generator Agent
feedback_agent = Agent(
    model=get_model(),
    result_type=AnswerFeedback,
    system_prompt="""You are a constructive interview coach providing detailed feedback.
    
    Evaluate answers based on:
    1. Clarity - Is the answer well-structured and easy to follow?
    2. Technical Accuracy - Are the facts and concepts correct?
    3. Completeness - Does it cover all aspects of the question?
    4. Communication - Is it professional and articulate?
    
    Provide:
    - Specific strengths (what they did well)
    - Actionable improvements (how to do better)
    - Missing topics (what should have been mentioned)
    - A model answer (example of excellence)
    - Optional follow-up question (if relevant)
    
    Be encouraging but honest. Scores should reflect actual quality:
    - 90-100: Excellent, interview-ready answer
    - 75-89: Good answer with minor gaps
    - 60-74: Acceptable but needs improvement
    - Below 60: Significant gaps, needs work
    
    ALWAYS provide constructive feedback, even for poor answers.
    """,
    retries=2,
)

async def generate_interview_question(
    interview_type: InterviewType,
    role: str,
    experience_level: ExperienceLevel,
    domain: Optional[str],
    session_id: str,
    previous_score: Optional[int] = None
) -> QuestionResponse:
    """
    Generate a contextual interview question using Pydantic AI
    
    Args:
        interview_type: Type of interview (technical/behavioral/hr)
        role: Job role being interviewed for
        experience_level: Candidate's experience level
        domain: Specific technology domain (optional)
        session_id: Current session ID
        previous_score: Score from previous question (to adjust difficulty)
    
    Returns:
        QuestionResponse: Structured question with metadata
    """
    try:
        # Build context prompt
        domain_text = f" with focus on {domain}" if domain else ""
        difficulty_hint = ""
        
        if previous_score is not None:
            if previous_score >= 85:
                difficulty_hint = "The candidate is doing well. Increase difficulty slightly."
            elif previous_score < 60:
                difficulty_hint = "The candidate is struggling. Ask a more fundamental question."
        
        prompt = f"""Generate a {interview_type.value} interview question for a {experience_level.value}-level {role}{domain_text}.
        
{difficulty_hint}

Return a structured question with:
- question: The actual question to ask
- context: Brief hint about what to focus on
- difficulty: easy/medium/hard
- expected_topics: List of 3-5 topics that should be covered in a good answer
- time_limit_seconds: Reasonable time to answer (120-300 seconds)

Make it realistic and interview-appropriate.
"""
        
        logger.info(f"Generating question for {role} - {interview_type.value}")
        
        result = await question_agent.run(prompt)
        
        # Add session_id to response
        response = result.data
        response.session_id = session_id
        
        logger.info(f"Question generated successfully: {response.question[:50]}...")
        return response
        
    except Exception as e:
        logger.error(f"Error generating question: {str(e)}")
        # Fallback question
        return QuestionResponse(
            session_id=session_id,
            question=f"Tell me about your experience with {role} responsibilities and what interests you about this role.",
            context="Focus on relevant experience and genuine interest",
            difficulty=DifficultyLevel.EASY,
            expected_topics=["relevant experience", "technical skills", "motivation", "learning approach"],
            time_limit_seconds=180
        )

async def evaluate_answer(
    question: str,
    answer: str,
    expected_topics: list[str],
    interview_type: InterviewType
) -> AnswerFeedback:
    """
    Evaluate candidate's answer using Pydantic AI
    
    Args:
        question: The question that was asked
        answer: Candidate's response
        expected_topics: Topics that should be covered
        interview_type: Type of interview for context
    
    Returns:
        AnswerFeedback: Structured feedback with scores and suggestions
    """
    try:
        prompt = f"""Evaluate this interview answer:

QUESTION: {question}

ANSWER: {answer}

EXPECTED TOPICS: {', '.join(expected_topics)}

INTERVIEW TYPE: {interview_type.value}

Provide detailed, structured feedback with:
1. Scores (0-100) for clarity, technical_accuracy, completeness, communication
2. Overall score (weighted average)
3. Specific strengths (what was done well)
4. Specific improvements (actionable suggestions)
5. Missing topics (if any)
6. A suggested model answer
7. Optional follow-up question

Be fair but constructive. Recognize good points even in weak answers.
"""
        
        logger.info(f"Evaluating answer for question: {question[:50]}...")
        
        result = await feedback_agent.run(prompt)
        feedback = result.data
        
        logger.info(f"Evaluation complete. Score: {feedback.overall_score}")
        return feedback
        
    except Exception as e:
        logger.error(f"Error evaluating answer: {str(e)}")
        # Fallback feedback
        return AnswerFeedback(
            overall_score=50,
            feedback_detail=FeedbackDetail(
                clarity=50,
                technical_accuracy=50,
                completeness=50,
                communication=50
            ),
            strengths=["You provided an answer", "Shows effort"],
            improvements=[
                "Try to structure your answer more clearly",
                "Include specific examples",
                "Cover the key topics mentioned in the question"
            ],
            missing_topics=expected_topics,
            suggested_answer="A strong answer would cover all expected topics with specific examples and clear structure.",
            follow_up_question=None
        )

# Utility function for health check
def check_agent_health() -> bool:
    """Check if agents are properly configured"""
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        return api_key is not None and len(api_key) > 0
    except Exception:
        return False
