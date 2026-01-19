# 📋 Quick Reference Card

## 🚀 Setup (5 Minutes)

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# Add OPENROUTER_API_KEY to .env
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**Open**: http://localhost:3000

---

## 🔑 Get API Key (Free)

1. Go to https://openrouter.ai/
2. Sign up (free, no credit card)
3. Create API key
4. Copy to `backend/.env`

---

## 📁 Key Files

```
backend/
├── main.py         # API routes
├── agent.py        # Pydantic AI agents
├── models.py       # Data models
└── .env            # API key here!

frontend/
├── app/page.tsx    # Main UI
├── lib/api.ts      # API client
└── .env.local      # Backend URL
```

---

## 🧪 Test Backend

```bash
# Option 1: cURL
curl http://localhost:8000/health

# Option 2: Python script
cd backend
python test_api.py
```

---

## 🚀 Deploy

### Backend (Render)
1. Push to GitHub
2. render.com → New Web Service
3. Connect repo
4. Root: `backend`
5. Build: `pip install -r requirements.txt`
6. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add env var: `OPENROUTER_API_KEY`

### Frontend (Vercel)
1. vercel.com → New Project
2. Import from GitHub
3. Root: `frontend`
4. Add env var: `NEXT_PUBLIC_API_URL`
5. Deploy!

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found | `pip install -r requirements.txt` |
| API key error | Check `.env` has `OPENROUTER_API_KEY` |
| CORS error | Check backend CORS_ORIGINS includes frontend URL |
| Port in use | Use `--port 8001` or kill process |
| Frontend won't start | `rm -rf node_modules && npm install` |

---

## 📊 API Endpoints

```
GET  /health                  → Health check
POST /api/interview/start     → Start interview
POST /api/interview/answer    → Submit answer
POST /api/interview/next      → Next question
GET  /api/interview/stats/:id → Get stats
```

---

## 🎥 Demo Video Checklist

- [ ] Under 60 seconds
- [ ] Face visible (required!)
- [ ] Live deployment (not localhost)
- [ ] Show: setup → question → answer → feedback
- [ ] Mention: Pydantic AI, FastAPI, Next.js
- [ ] Clear problem statement
- [ ] Professional delivery

---

## ✅ Submission Checklist

- [ ] Live backend URL
- [ ] Live frontend URL
- [ ] GitHub repo (public)
- [ ] Loom video (60s, face visible)
- [ ] Resume PDF
- [ ] Test full flow works
- [ ] Mobile responsive
- [ ] No console errors

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| START_HERE.md | First-time setup |
| QUICKSTART.md | Quick reference |
| DEPLOYMENT.md | Deploy guide |
| LOOM_SCRIPT.md | Demo script |
| COMPLETE_GUIDE.md | Everything |

---

## 💡 Tips

✅ Test locally before deploying  
✅ Keep both terminals running  
✅ Watch backend logs for errors  
✅ Check browser console (F12)  
✅ Practice demo 2-3 times  
✅ Deploy early, test often  

---

## 🎯 Tech Stack

**Backend**: Python 3.11 + FastAPI + Pydantic AI  
**Frontend**: Next.js 15 + TypeScript + Tailwind  
**LLM**: OpenRouter (free tier)  
**Deploy**: Render + Vercel (free)  
**Cost**: $0/month  

---

## 🏆 Success!

If you can:
- ✅ Start interview
- ✅ Get AI question
- ✅ Submit answer
- ✅ See feedback

**You're ready to deploy! 🚀**

---

**Quick Links**:
- OpenRouter: https://openrouter.ai/
- Render: https://render.com/
- Vercel: https://vercel.com/

**Built for SRM Interview - January 2026**
