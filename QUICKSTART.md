# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get OpenRouter API Key (FREE)
1. Go to https://openrouter.ai/
2. Sign up (free)
3. Create API key
4. Copy the key

### Step 2: Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
uvicorn main:app --reload --port 8000
```

Backend running at http://localhost:8000

### Step 3: Setup Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local - default is already correct for local dev
npm run dev
```

Frontend running at http://localhost:3000

### Step 4: Test It!
1. Open http://localhost:3000
2. Select "Technical Interview"
3. Enter role: "Software Engineer"
4. Click "Start Interview"
5. Answer the question
6. Get AI feedback!

---

## 📁 Project Structure

```
interview-prep-simulator/
├── backend/                 # FastAPI + Pydantic AI
│   ├── main.py             # API routes
│   ├── agent.py            # Pydantic AI agents
│   ├── models.py           # Pydantic models
│   ├── utils.py            # Helper functions
│   ├── requirements.txt    # Dependencies
│   ├── .env.example        # Environment template
│   └── Procfile           # Deployment config
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── page.tsx       # Main UI
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Styles
│   ├── lib/
│   │   └── api.ts         # API client
│   └── package.json
├── README.md              # Main documentation
├── DEPLOYMENT.md          # Deployment guide
├── LOOM_SCRIPT.md        # Demo script
└── QUICKSTART.md         # This file
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxx
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎯 Main Features

1. **Start Interview** - Select type, role, experience level
2. **Get Question** - AI generates contextual question
3. **Submit Answer** - Type or paste your response
4. **Get Feedback** - Detailed scoring and suggestions
5. **Continue** - Get next question or end interview

---

## 🧪 Test the API

```bash
# Health check
curl http://localhost:8000/health

# Start interview
curl -X POST http://localhost:8000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{
    "interview_type": "technical",
    "role": "Software Engineer",
    "experience_level": "intermediate"
  }'
```

---

## 🐛 Common Issues

### Backend won't start
- Check Python version (3.11+)
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Check `.env` file exists with valid API key

### Frontend won't start
- Check Node version (18+)
- Install dependencies: `npm install`
- Clear cache: `rm -rf .next`
- Check `.env.local` exists

### CORS errors
- Make sure backend CORS_ORIGINS includes frontend URL
- Check both servers are running
- Try clearing browser cache

### LLM not responding
- Verify OpenRouter API key is valid
- Check OpenRouter dashboard for usage limits
- Look at backend logs for errors
- Try a different free model in `agent.py`

---

## 📦 Dependencies

### Backend
- fastapi - Web framework
- pydantic-ai - AI agent framework
- uvicorn - ASGI server
- python-dotenv - Environment variables
- httpx - HTTP client
- openai - OpenAI API (used by OpenRouter)

### Frontend
- next - React framework
- react - UI library
- axios - HTTP client
- framer-motion - Animations
- lucide-react - Icons
- react-hot-toast - Notifications
- tailwindcss - Styling

---

## 🚀 Next Steps

1. **Test Locally** - Make sure everything works
2. **Deploy Backend** - Follow DEPLOYMENT.md
3. **Deploy Frontend** - Follow DEPLOYMENT.md
4. **Record Demo** - Follow LOOM_SCRIPT.md
5. **Submit** - Live URL, GitHub, Loom, Resume

---

## 💡 Tips

- Use the free tier models to start
- Test with different interview types
- Try various experience levels
- Practice your demo before recording
- Check mobile responsiveness
- Monitor backend logs for errors

---

## 📞 Need Help?

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for deployment steps
- Read `LOOM_SCRIPT.md` for demo tips
- Check backend logs: Look at terminal running FastAPI
- Check frontend logs: Browser console (F12)

---

## ✅ Pre-Deployment Checklist

- [ ] Backend works locally
- [ ] Frontend works locally
- [ ] Both can communicate
- [ ] Questions generate properly
- [ ] Answers evaluate correctly
- [ ] Feedback displays nicely
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Error handling works

---

**You're all set! Start building and good luck with your interview! 🎯**
