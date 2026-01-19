#!/bin/bash

# Interview Prep Simulator - Local Setup Commands (Mac/Linux)

echo "🚀 Setting up Interview Prep Simulator..."

# 1. BACKEND SETUP
echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file - PLEASE ADD YOUR OPENROUTER_API_KEY!"
else
    echo "ℹ️  .env already exists"
fi

echo "✅ Backend setup complete!"
echo "   To run: uvicorn main:app --reload --port 8000"

# 2. FRONTEND SETUP
echo ""
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local file"
else
    echo "ℹ️  .env.local already exists"
fi

echo "✅ Frontend setup complete!"
echo "   To run: npm run dev"

# 3. NEXT STEPS
echo ""
echo "=== 🎯 NEXT STEPS ==="
echo "1. Edit backend/.env and add your OPENROUTER_API_KEY"
echo "   Get free key at: https://openrouter.ai/"
echo ""
echo "2. Run backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload --port 8000"
echo ""
echo "3. In new terminal, run frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in browser"
echo ""
echo "5. See QUICKSTART.md for more details"
echo ""
echo "✨ Ready to go! Good luck with your interview! ✨"
