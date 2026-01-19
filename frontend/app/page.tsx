'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles,
    Send,
    Loader2,
    Award,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    BarChart3,
    Brain,
    Target,
    Lightbulb,
    RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api, QuestionResponse, AnswerFeedback, StartInterviewRequest } from '@/lib/api'

type Stage = 'setup' | 'question' | 'feedback' | 'complete'

export default function Home() {
    const [stage, setStage] = useState<Stage>('setup')
    const [loading, setLoading] = useState(false)

    // Setup state
    const [interviewType, setInterviewType] = useState<StartInterviewRequest['interview_type']>('technical')
    const [role, setRole] = useState('')
    const [experienceLevel, setExperienceLevel] = useState<StartInterviewRequest['experience_level']>('intermediate')
    const [domain, setDomain] = useState('')

    // Interview state
    const [sessionId, setSessionId] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState<QuestionResponse | null>(null)
    const [answer, setAnswer] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(180)
    const [timerActive, setTimerActive] = useState(false)

    // Feedback state
    const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
    const [questionsAsked, setQuestionsAsked] = useState(0)
    const [totalScore, setTotalScore] = useState(0)

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timerActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timerActive, timeRemaining])

    const handleStartInterview = async () => {
        if (!role.trim()) {
            toast.error('Please enter a job role')
            return
        }

        setLoading(true)
        try {
            const question = await api.startInterview({
                interview_type: interviewType,
                role: role.trim(),
                experience_level: experienceLevel,
                domain: domain.trim() || undefined,
            })

            setCurrentQuestion(question)
            setSessionId(question.session_id)
            setTimeRemaining(question.time_limit_seconds)
            setTimerActive(true)
            setStage('question')
            toast.success('Interview started! Good luck! 🚀')
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to start interview')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitAnswer = async () => {
        if (!answer.trim() || answer.trim().length < 10) {
            toast.error('Please provide a more detailed answer (at least 10 characters)')
            return
        }

        setLoading(true)
        setTimerActive(false)

        try {
            const result = await api.submitAnswer({
                session_id: sessionId,
                question: currentQuestion!.question,
                answer: answer.trim(),
            })

            setFeedback(result)
            setQuestionsAsked(prev => prev + 1)
            setTotalScore(prev => prev + result.overall_score)
            setStage('feedback')

            if (result.overall_score >= 80) {
                toast.success('Excellent answer! 🌟')
            } else if (result.overall_score >= 60) {
                toast.success('Good effort! 👍')
            } else {
                toast('Keep practicing! 💪', { icon: '📚' })
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to evaluate answer')
            console.error(error)
            setTimerActive(true)
        } finally {
            setLoading(false)
        }
    }

    const handleNextQuestion = async () => {
        setLoading(true)
        try {
            const question = await api.getNextQuestion(sessionId, feedback?.overall_score)

            setCurrentQuestion(question)
            setAnswer('')
            setFeedback(null)
            setTimeRemaining(question.time_limit_seconds)
            setTimerActive(true)
            setStage('question')
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to get next question')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEndInterview = () => {
        setStage('complete')
        setTimerActive(false)
    }

    const handleRestart = () => {
        setStage('setup')
        setSessionId('')
        setCurrentQuestion(null)
        setAnswer('')
        setFeedback(null)
        setQuestionsAsked(0)
        setTotalScore(0)
        setTimeRemaining(180)
        setTimerActive(false)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200'
        if (score >= 60) return 'bg-yellow-50 border-yellow-200'
        return 'bg-red-50 border-red-200'
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Interview Prep Simulator
                            </h1>
                            <p className="text-gray-600">AI-powered practice with real-time feedback</p>
                        </div>
                    </div>

                    {stage !== 'setup' && (
                        <button onClick={handleRestart} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" />
                            New Interview
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                {stage !== 'setup' && stage !== 'complete' && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(questionsAsked / Math.max(questionsAsked + 1, 1)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                )}
            </motion.header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* Setup Stage */}
                    {stage === 'setup' && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="card-gradient">
                                <div className="flex items-center gap-2 mb-6">
                                    <Target className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-800">Setup Your Interview</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Interview Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Interview Type
                                        </label>
                                        <select
                                            value={interviewType}
                                            onChange={(e) => setInterviewType(e.target.value as any)}
                                            className="select-field"
                                        >
                                            <option value="technical">Technical Interview</option>
                                            <option value="behavioral">Behavioral Interview</option>
                                            <option value="hr">HR Interview</option>
                                            <option value="system_design">System Design</option>
                                        </select>
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Job Role <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            placeholder="e.g., Software Engineer, Product Manager"
                                            className="input-field"
                                        />
                                    </div>

                                    {/* Experience Level */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Experience Level
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['entry', 'intermediate', 'senior'] as const).map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setExperienceLevel(level)}
                                                    className={`py-3 rounded-xl font-semibold transition-all ${experienceLevel === level
                                                            ? 'bg-blue-600 text-white shadow-lg'
                                                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
                                                        }`}
                                                >
                                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Domain (optional) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Domain/Technology (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            placeholder="e.g., React, Python, Machine Learning"
                                            className="input-field"
                                        />
                                    </div>

                                    <button
                                        onClick={handleStartInterview}
                                        disabled={loading}
                                        className="btn-primary w-full text-lg py-4"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Starting Interview...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Sparkles className="w-6 h-6" />
                                                Start Interview
                                                <ArrowRight className="w-6 h-6" />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid md:grid-cols-3 gap-4 mt-8">
                                <div className="card text-center">
                                    <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">AI-Powered Questions</p>
                                </div>
                                <div className="card text-center">
                                    <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Detailed Scoring</p>
                                </div>
                                <div className="card text-center">
                                    <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Actionable Feedback</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Question Stage */}
                    {stage === 'question' && currentQuestion && (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="grid gap-6">
                                {/* Question Card */}
                                <div className="card-gradient">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Award className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Question {questionsAsked + 1}</p>
                                                <p className="text-xs text-gray-500 capitalize">
                                                    {currentQuestion.difficulty} • {interviewType}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 30 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <Clock className="w-5 h-5" />
                                            <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        {currentQuestion.question}
                                    </h3>

                                    <p className="text-gray-600 mb-4 italic">
                                        💡 {currentQuestion.context}
                                    </p>

                                    {currentQuestion.expected_topics.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {currentQuestion.expected_topics.map((topic, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Answer Input */}
                                <div className="card">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Your Answer
                                    </label>
                                    <textarea
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Type your answer here... Be clear, structured, and thorough."
                                        className="textarea-field h-48 mb-4"
                                        disabled={loading}
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSubmitAnswer}
                                            disabled={loading || !answer.trim()}
                                            className="btn-primary flex-1"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Evaluating...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Send className="w-5 h-5" />
                                                    Submit Answer
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Feedback Stage */}
                    {stage === 'feedback' && feedback && (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="grid gap-6">
                                {/* Score Card */}
                                <div className={`card-gradient border-2 ${getScoreBgColor(feedback.overall_score)}`}>
                                    <div className="text-center mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', duration: 0.5 }}
                                            className="inline-block"
                                        >
                                            <div className={`text-7xl font-bold ${getScoreColor(feedback.overall_score)}`}>
                                                {feedback.overall_score}
                                            </div>
                                            <p className="text-gray-600 text-lg">Overall Score</p>
                                        </motion.div>
                                    </div>

                                    {/* Score Breakdown */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(feedback.feedback_detail).map(([key, value]) => (
                                            <div key={key} className="text-center">
                                                <div className={`text-3xl font-bold ${getScoreColor(value)}`}>
                                                    {value}
                                                </div>
                                                <p className="text-xs text-gray-600 capitalize">
                                                    {key.replace('_', ' ')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths */}
                                <div className="card bg-green-50 border-2 border-green-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        <h3 className="text-xl font-bold text-gray-800">Strengths</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {feedback.strengths.map((strength, idx) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="text-green-600 mt-1">✓</span>
                                                <span className="text-gray-700">{strength}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Improvements */}
                                <div className="card bg-blue-50 border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                        <h3 className="text-xl font-bold text-gray-800">Areas to Improve</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {feedback.improvements.map((improvement, idx) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="text-blue-600 mt-1">→</span>
                                                <span className="text-gray-700">{improvement}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Missing Topics */}
                                {feedback.missing_topics.length > 0 && (
                                    <div className="card bg-yellow-50 border-2 border-yellow-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <XCircle className="w-6 h-6 text-yellow-600" />
                                            <h3 className="text-xl font-bold text-gray-800">Missing Topics</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.missing_topics.map((topic, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Model Answer */}
                                <div className="card bg-purple-50 border-2 border-purple-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Lightbulb className="w-6 h-6 text-purple-600" />
                                        <h3 className="text-xl font-bold text-gray-800">Suggested Answer</h3>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {feedback.suggested_answer}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={loading}
                                        className="btn-primary flex-1"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Loading...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Next Question
                                                <ArrowRight className="w-5 h-5" />
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleEndInterview}
                                        className="btn-secondary"
                                    >
                                        End Interview
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Complete Stage */}
                    {stage === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="card-gradient">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', duration: 0.6 }}
                                    className="mb-6"
                                >
                                    <Award className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                        Interview Complete!
                                    </h2>
                                    <p className="text-gray-600">Great job practicing!</p>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="card-gradient">
                                        <p className="text-gray-600 mb-2">Questions Answered</p>
                                        <p className="text-4xl font-bold text-blue-600">{questionsAsked}</p>
                                    </div>
                                    <div className="card-gradient">
                                        <p className="text-gray-600 mb-2">Average Score</p>
                                        <p className={`text-4xl font-bold ${getScoreColor(Math.round(totalScore / questionsAsked))}`}>
                                            {Math.round(totalScore / questionsAsked)}
                                        </p>
                                    </div>
                                </div>

                                <button onClick={handleRestart} className="btn-primary w-full text-lg py-4">
                                    <span className="flex items-center justify-center gap-2">
                                        <RefreshCw className="w-6 h-6" />
                                        Start New Interview
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
