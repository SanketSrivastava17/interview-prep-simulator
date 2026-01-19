# Interview Prep Simulator 🎯

An AI-powered interview preparation platform that helps you practice technical and behavioral interviews with real-time feedback.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15-black.svg)

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](your-vercel-url)
- **Backend API**: [Deployed on Render](your-render-url)
- **Demo Video**: [Watch on Loom](your-loom-url)

## 📋 Problem Statement

Students and job seekers struggle to prepare for interviews effectively without:
- Real-time feedback on their answers
- Understanding of what interviewers look for
- Practice with diverse question types
- Personalized improvement suggestions

## 💡 Solution

An AI agent system built with **Pydantic AI** that:
1. Generates contextual interview questions based on role/domain
2. Analyzes user responses in real-time
3. Provides detailed scoring and feedback
4. Suggests specific improvements
5. Tracks progress across sessions

## ✨ Features

### Core Functionality
- 🎭 **Multiple Interview Types**: Technical, Behavioral, HR rounds
- 🧠 **Smart Question Generation**: Role-specific questions using AI
- 📊 **Real-time Analysis**: Instant feedback on answers
- ⭐ **Detailed Scoring**: Clarity, relevance, technical accuracy
- 📈 **Progress Tracking**: See improvement over time
- 💬 **Follow-up Questions**: Dynamic conversation flow

### Technical Highlights
- ✅ Pydantic AI for structured agent responses
- ✅ FastAPI backend with full validation
- ✅ Next.js 15 with TypeScript
- ✅ Tailwind CSS for beautiful UI
- ✅ Framer Motion animations
- ✅ Error handling & retry logic
- ✅ Logging and monitoring
- ✅ Environment-based configuration

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js UI    │
│  (Vercel)       │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  FastAPI Server │
│  (Render)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Pydantic AI    │─────▶│  OpenRouter  │
│  Agent System   │      │  (Free LLM)  │
└─────────────────┘      └──────────────┘
```

## 📁 Project Structure

```
interview-prep-simulator/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # Pydantic models
│   ├── agent.py                # Pydantic AI agent logic
│   ├── utils.py                # Helper functions
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment template
│   └── Procfile               # Deployment config
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main interview UI
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── InterviewCard.tsx  # Question display
│   │   ├── FeedbackPanel.tsx  # Results display
│   │   └── LoadingState.tsx   # Loading animations
│   ├── lib/
│   │   └── api.ts             # API client
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **AI Agent**: Pydantic AI
- **LLM**: OpenRouter (free models)
- **Validation**: Pydantic v2
- **Server**: Uvicorn (ASGI)

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **UI Feedback**: React Hot Toast

### Deployment
- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Environment**: Production-ready configs

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm/yarn
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd interview-prep-simulator/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

5. **Run the server**
```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create new Web Service on Render**
2. **Connect GitHub repository**
3. **Configure:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables: Add `OPENROUTER_API_KEY`
4. **Deploy**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy from frontend directory**
```bash
cd frontend
vercel
```

3. **Configure environment:**
   - Add `NEXT_PUBLIC_API_URL` with your Render backend URL
   - Redeploy

4. **Production deployment**
```bash
vercel --prod
```

## 🔑 Environment Variables

### Backend (.env)
```env
OPENROUTER_API_KEY=your_openrouter_api_key
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## 🧪 API Endpoints

### GET `/`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "Interview Prep Simulator API",
  "version": "1.0.0"
}
```

### POST `/api/interview/start`
Start new interview session

**Request:**
```json
{
  "interview_type": "technical",
  "role": "Software Engineer",
  "experience_level": "intermediate"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "question": "Explain the difference between REST and GraphQL",
  "context": "technical",
  "difficulty": "medium"
}
```

### POST `/api/interview/answer`
Submit answer and get feedback

**Request:**
```json
{
  "session_id": "uuid",
  "question": "...",
  "answer": "User's answer text"
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": {
    "clarity": "Excellent",
    "technical_accuracy": "Good",
    "completeness": "Could be improved"
  },
  "suggestions": ["Add more examples", "Explain edge cases"],
  "next_question": "Follow-up question..."
}
```

## 🎨 Design Philosophy

- **Minimalist**: Clean, distraction-free interface
- **Fast**: Optimistic UI updates, smooth transitions
- **Accessible**: Keyboard navigation, screen reader support
- **Responsive**: Mobile-first design
- **Professional**: Interview-ready aesthetic

## 📊 Agent System Details

The Pydantic AI agent uses structured reasoning:

1. **Input Validation** - Pydantic models ensure clean data
2. **Context Building** - Maintains conversation history
3. **Question Generation** - Role-aware, difficulty-adjusted
4. **Answer Analysis** - Multi-dimensional scoring
5. **Feedback Generation** - Actionable, specific suggestions
6. **Retry Logic** - Fallback responses if LLM fails
7. **Logging** - Full audit trail

## 🎥 Loom Demo Script

**[30 seconds] - Introduction & Problem**
- "Hi, I'm [Name]. I built Interview Prep Simulator."
- "It solves a real problem - students need interview practice with feedback."
- *Show landing page*

**[20 seconds] - Live Demo**
- "Select 'Technical Interview' for Software Engineer role"
- "AI generates a relevant question using Pydantic AI"
- *Type answer*
- "Real-time analysis with detailed scoring"
- *Show feedback panel*

**[10 seconds] - Tech & Deployment**
- "Built with Pydantic AI, FastAPI, Next.js"
- "Live on Vercel and Render"
- "Full code on GitHub"

## 🛡️ Error Handling

- ✅ API request failures with retry logic
- ✅ LLM timeout handling with fallbacks
- ✅ Input validation at every layer
- ✅ User-friendly error messages
- ✅ Logging for debugging

## 📈 Future Enhancements

- [ ] User authentication & session persistence
- [ ] Interview history & analytics
- [ ] Video response analysis
- [ ] Company-specific question banks
- [ ] Collaborative mock interviews
- [ ] Mobile app

## 🤝 Contributing

This is an interview project, but suggestions welcome via issues!

## 📄 License

MIT License - feel free to use for learning

## 👤 Author

**[Your Name]**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built for SRM University recruitment process
- Uses OpenRouter's free tier for LLM access
- Inspired by real interview preparation needs

---

**Built with ❤️ for the SRM Interview Process - January 2026**

*"Practice makes perfect - especially with AI feedback!"*
