# ✅ Setup Complete!

Backend and frontend are now set up and ready to run!

## 🔑 IMPORTANT: Get Your API Key

**You MUST do this before running the backend:**

1. Go to **https://openrouter.ai/**
2. Click "Sign In" → Sign up (free, no credit card needed)
3. Go to "Keys" tab
4. Click "Create Key"
5. Copy the key (starts with `sk-or-v1-...`)
6. Open `backend\.env` in VS Code
7. Replace `your_openrouter_api_key_here` with your actual key
8. Save the file

**Without this API key, the backend will not work!**

---

## 🚀 Run the Application

### Terminal 1 - Backend Server

```powershell
cd d:\assignment_potpie\backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     🚀 Starting Interview Prep Simulator API
```

**Keep this terminal running!**

### Terminal 2 - Frontend Server

Open a NEW terminal in VS Code (Terminal → New Terminal), then:

```powershell
cd d:\assignment_potpie\frontend
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

**Keep this terminal running too!**

---

## ✅ Test It Works

1. Open browser to **http://localhost:3000**
2. Fill in the form:
   - Interview Type: Technical
   - Role: Software Engineer
   - Experience: Intermediate
3. Click "Start Interview"
4. Answer the AI-generated question
5. Get detailed feedback!

---

## 📁 What Was Set Up

✅ Backend virtual environment created
✅ Python dependencies installed (Pydantic AI, FastAPI, etc.)
✅ `.env` file created (you need to add API key)
✅ Frontend dependencies installed (Next.js, React, etc.)
✅ `.env.local` file created (already configured)

---

## 🐛 Troubleshooting

### Backend won't start?
- Make sure you added your OpenRouter API key to `backend\.env`
- Check virtual environment is activated (you see `(venv)` in terminal)

### Frontend won't start?
- Make sure you're in the `frontend` directory
- Try: `npm install` again

### Can't connect?
- Make sure BOTH servers are running
- Backend on port 8000
- Frontend on port 3000

---

## 📚 Next Steps

After testing locally:
1. Deploy backend to Render (see `DEPLOYMENT.md`)
2. Deploy frontend to Vercel (see `DEPLOYMENT.md`)
3. Record your Loom demo (see `LOOM_SCRIPT.md`)
4. Submit all deliverables

---

**You're all set! Get your API key and start testing! 🎉**
