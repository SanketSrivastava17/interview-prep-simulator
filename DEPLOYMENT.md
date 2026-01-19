# Deployment Guide

## Backend Deployment (Render)

### Option 1: Deploy via Render Dashboard

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: `interview-prep-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add: `OPENROUTER_API_KEY` = `your_api_key_here`
   - Add: `CORS_ORIGINS` = `https://your-frontend.vercel.app,http://localhost:3000`
   - Add: `LOG_LEVEL` = `INFO`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy your backend URL (e.g., `https://interview-prep-api.onrender.com`)

### Option 2: Deploy via Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as above)
6. Deploy

---

## Frontend Deployment (Vercel)

### Via Vercel Dashboard

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Deploy via Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL

### Via CLI (Faster)

```bash
cd frontend
vercel login
vercel --prod
```

Follow prompts and add environment variables when asked.

---

## Getting OpenRouter API Key (FREE)

1. Go to [openrouter.ai](https://openrouter.ai/)
2. Click "Sign In" → Sign up with Google/GitHub
3. Go to "Keys" → "Create Key"
4. Copy the key
5. Free models available:
   - `google/gemma-2-9b-it:free`
   - `meta-llama/llama-3-8b-instruct:free`
   - `microsoft/phi-3-mini-128k-instruct:free`

---

## Post-Deployment Checklist

- [ ] Backend is live and `/health` endpoint works
- [ ] Frontend is live and loads properly
- [ ] Environment variables are set correctly
- [ ] CORS is configured with frontend URL
- [ ] Test creating interview session
- [ ] Test submitting answers
- [ ] Check error handling works
- [ ] Mobile responsive
- [ ] Performance is good (< 3s load time)

---

## Updating Deployment

### Backend
- Push changes to GitHub
- Render auto-deploys on push to `main`
- Or manually trigger in Render dashboard

### Frontend
- Push changes to GitHub
- Vercel auto-deploys on push to `main`
- Or run `vercel --prod` from frontend directory

---

## Monitoring & Logs

### Render
- Dashboard → Your Service → Logs tab
- View real-time logs
- Check for errors

### Vercel
- Dashboard → Your Project → Deployments
- Click deployment → View Logs
- Runtime Logs show errors

---

## Troubleshooting

### Backend not starting
- Check `requirements.txt` has all dependencies
- Verify `OPENROUTER_API_KEY` is set
- Check logs for Python errors
- Ensure `runtime.txt` specifies Python 3.11

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Test backend `/health` endpoint directly
- Check browser console for errors

### LLM requests failing
- Verify OpenRouter API key is valid
- Check OpenRouter dashboard for usage
- Ensure free model name is correct
- Check backend logs for API errors

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate

### Render
1. Go to Settings → Custom Domain
2. Add domain
3. Configure DNS
4. SSL auto-provisions

---

## Cost Estimate

- **Render Free Tier**: $0/month (sleeps after 15 min inactivity)
- **Railway Free Tier**: $5 credit/month
- **Vercel Free Tier**: Unlimited for personal projects
- **OpenRouter**: Free tier with rate limits
- **Total**: $0/month for MVP

---

## Production Upgrades

When ready to scale:

1. **Database**: Add PostgreSQL/MongoDB for session persistence
2. **Redis**: Add for caching and session management
3. **Authentication**: Add user accounts (Clerk/Auth0)
4. **Analytics**: Add Posthog/Mixpanel
5. **Monitoring**: Add Sentry for error tracking
6. **Paid LLM**: Upgrade to GPT-4 for better quality

---

## Security Checklist

- [ ] API keys in environment variables (not in code)
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] Rate limiting (add in production)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] No sensitive data in logs
- [ ] `.env` files in `.gitignore`
