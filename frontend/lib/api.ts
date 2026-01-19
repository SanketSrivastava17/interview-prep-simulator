import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface StartInterviewRequest {
    interview_type: 'technical' | 'behavioral' | 'hr' | 'system_design'
    role: string
    experience_level: 'entry' | 'intermediate' | 'senior'
    domain?: string
}

export interface QuestionResponse {
    session_id: string
    question: string
    context: string
    difficulty: string
    expected_topics: string[]
    time_limit_seconds: number
}

export interface SubmitAnswerRequest {
    session_id: string
    question: string
    answer: string
}

export interface FeedbackDetail {
    clarity: number
    technical_accuracy: number
    completeness: number
    communication: number
}

export interface AnswerFeedback {
    overall_score: number
    feedback_detail: FeedbackDetail
    strengths: string[]
    improvements: string[]
    missing_topics: string[]
    suggested_answer: string
    follow_up_question?: string
}

export interface SessionStats {
    session_id: string
    questions_asked: number
    average_score: number
    scores: number[]
    created_at: string
}

class API {
    private client = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds
    })

    async startInterview(data: StartInterviewRequest): Promise<QuestionResponse> {
        const response = await this.client.post<QuestionResponse>('/api/interview/start', data)
        return response.data
    }

    async submitAnswer(data: SubmitAnswerRequest): Promise<AnswerFeedback> {
        const response = await this.client.post<AnswerFeedback>('/api/interview/answer', data)
        return response.data
    }

    async getNextQuestion(session_id: string, previous_score?: number): Promise<QuestionResponse> {
        const response = await this.client.post<QuestionResponse>('/api/interview/next', {
            session_id,
            previous_score,
        })
        return response.data
    }

    async getSessionStats(session_id: string): Promise<SessionStats> {
        const response = await this.client.get<SessionStats>(`/api/interview/stats/${session_id}`)
        return response.data
    }

    async healthCheck(): Promise<{ status: string; agent_ready: boolean }> {
        const response = await this.client.get('/health')
        return response.data
    }
}

export const api = new API()
