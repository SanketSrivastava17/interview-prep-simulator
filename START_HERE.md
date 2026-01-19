# 🚀 START HERE - First Time Setup

Welcome! This guide will get you from zero to running in **10 minutes**.

## 📋 Prerequisites Check

Before starting, make sure you have:
- [ ] **Python 3.11+** - Run `python --version`
- [ ] **Node.js 18+** - Run `node --version`
- [ ] **npm** - Run `npm --version`
- [ ] **Git** - Run `git --version`

Don't have these? Install from:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## ⚡ Quick Setup (Choose Your OS)

### Windows (PowerShell)
```powershell
# Run the setup script
.\setup.ps1
```

### Mac/Linux (Bash)
```bash
# Make script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

### Manual Setup (All Platforms)

If scripts don't work, follow these steps:

#### Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
```

---

## 🔑 Get Your FREE API Key

1. Go to **https://openrouter.ai/**
2. Click "Sign In" → Sign up (free, no credit card)
3. Go to "Keys" tab
4. Click "Create Key"
5. Copy the key (starts with `sk-or-v1-...`)
6. Open `backend/.env`
7. Paste: `OPENROUTER_API_KEY=sk-or-v1-your-key-here`
8. Save the file

**This is required or the app won't work!**

---

## 🏃 Run the Application

### Terminal 1 - Backend
```bash
cd backend

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     🚀 Starting Interview Prep Simulator API
```

Keep this terminal running!

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

Keep this terminal running too!

---

## ✅ Test It Works

1. Open browser to **http://localhost:3000**
2. You should see the Interview Prep Simulator landing page
3. Fill in:
   - Interview Type: Technical
   - Role: Software Engineer
   - Experience: Intermediate
4. Click "Start Interview"
5. You should get an AI-generated question
6. Type an answer (at least 10 characters)
7. Click "Submit Answer"
8. You should get detailed feedback!

**If this works, you're all set! 🎉**

---

## 🐛 Troubleshooting

### Backend Issues

**"ModuleNotFoundError"**
```bash
# Make sure virtual environment is activated
# You should see (venv) in your terminal prompt

# Then reinstall:
pip install -r requirements.txt
```

**"OPENROUTER_API_KEY not found"**
```bash
# Check .env file exists in backend/ folder
# Make sure it contains: OPENROUTER_API_KEY=sk-or-v1-...
```

**"Port 8000 already in use"**
```bash
# Use a different port:
uvicorn main:app --reload --port 8001

# Then update frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Frontend Issues

**"Module not found"**
```bash
# Delete node_modules and reinstall:
rm -rf node_modules
npm install
```

**"CORS error"**
```bash
# Make sure backend is running on port 8000
# Or update backend/.env CORS_ORIGINS to match your frontend URL
```

**"Can't connect to backend"**
```bash
# Check backend is running
# Visit http://localhost:8000/health in browser
# Should see: {"status":"healthy","agent_ready":true}
```

### Still Not Working?

1. Check both terminals for error messages
2. Make sure both servers are running
3. Try clearing browser cache (Ctrl+Shift+Delete)
4. Check `.env` files are configured correctly
5. See `QUICKSTART.md` for more details

---

## 📚 What's Next?

Once local development works:

1. **Read Documentation**
   - `README.md` - Full project overview
   - `QUICKSTART.md` - Detailed setup guide
   - `DEPLOYMENT.md` - How to deploy
   - `LOOM_SCRIPT.md` - How to record demo

2. **Deploy to Production**
   - Follow steps in `DEPLOYMENT.md`
   - Backend → Render/Railway (free tier)
   - Frontend → Vercel (free tier)

3. **Record Demo Video**
   - Follow script in `LOOM_SCRIPT.md`
   - Keep under 60 seconds
   - Show face, explain live

4. **Prepare Submission**
   - Live deployment URL
   - GitHub repository (make it public!)
   - Loom video
   - Resume PDF

---

## 🎯 Quick Commands Reference

### Backend
```bash
# Start server
uvicorn main:app --reload --port 8000

# Check health
curl http://localhost:8000/health

# View logs
# Just watch the terminal where server is running
```

### Frontend
```bash
# Development
npm run dev

# Production build (test before deploying)
npm run build
npm start

# Lint
npm run lint
```

### Both
```bash
# Stop servers
Ctrl+C in each terminal
```

---

## 💡 Pro Tips

1. **Keep terminals visible** - Watch for errors in real-time
2. **Test after each change** - Catch issues early
3. **Read error messages** - They usually tell you what's wrong
4. **Use browser DevTools** - F12 to see console errors
5. **Check Network tab** - See API requests/responses

---

## 🆘 Need More Help?

- Full docs: `README.md`
- Setup guide: `QUICKSTART.md`
- Deployment: `DEPLOYMENT.md`
- Demo script: `LOOM_SCRIPT.md`
- Project status: `PROJECT_STATUS.md`

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can start interview
- [ ] Can submit answer
- [ ] Can see feedback
- [ ] No console errors
- [ ] OpenRouter API key works

**All checked? You're ready to deploy! 🚀**

---

**Built with ❤️ for SRM Interview Process**

*Remember: You've got this! The app is production-ready. Just follow the guides step by step.*
