# Interview Prep Simulator - Local Setup Commands

# These commands will get you running locally in minutes

# 1. BACKEND SETUP
Write-Host "Setting up backend..." -ForegroundColor Green
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env file - PLEASE ADD YOUR OPENROUTER_API_KEY!" -ForegroundColor Yellow
}
else {
    Write-Host ".env already exists" -ForegroundColor Cyan
}

Write-Host "Backend setup complete!" -ForegroundColor Green
Write-Host "To run backend: uvicorn main:app --reload --port 8000" -ForegroundColor Cyan

# 2. FRONTEND SETUP
Write-Host "`nSetting up frontend..." -ForegroundColor Green
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
if (-not (Test-Path .env.local)) {
    Copy-Item .env.local.example .env.local
    Write-Host "Created .env.local file" -ForegroundColor Green
}
else {
    Write-Host ".env.local already exists" -ForegroundColor Cyan
}

Write-Host "Frontend setup complete!" -ForegroundColor Green
Write-Host "To run frontend: npm run dev" -ForegroundColor Cyan

# 3. NEXT STEPS
Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Magenta
Write-Host "1. Edit backend/.env and add your OPENROUTER_API_KEY" -ForegroundColor Yellow
Write-Host "   Get free key at: https://openrouter.ai/" -ForegroundColor Yellow
Write-Host "`n2. Run backend:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   .\venv\Scripts\activate" -ForegroundColor White
Write-Host "   uvicorn main:app --reload --port 8000" -ForegroundColor White
Write-Host "`n3. In new terminal, run frontend:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "`n4. Open http://localhost:3000 in browser" -ForegroundColor Green
Write-Host "`n5. See QUICKSTART.md for more details" -ForegroundColor Cyan
