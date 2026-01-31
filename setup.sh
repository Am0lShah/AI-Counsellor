#!/bin/bash

echo "====================================="
echo " AI Counsellor MVP - Setup Script   "
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "Step 1: Setting up PostgreSQL with Docker..."
if command -v docker &> /dev/null; then
    echo "✓ Docker found"
    docker-compose up -d
    echo -e "${GREEN}✓ PostgreSQL started${NC}"
    sleep 3
else
    echo -e "${YELLOW}⚠ Docker not found. Please install Docker or setup PostgreSQL manually${NC}"
fi

echo ""
echo "Step 2: Setting up Backend..."
cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ];then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit backend/.env and add your API keys${NC}"
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Initialize database
echo "Initializing database..."
python -c "from database import init_db; init_db()"
echo -e "${GREEN}✓ Database initialized${NC}"

# Seed university data
echo "Seeding university data..."
python utils/seed_data.py
echo -e "${GREEN}✓ University data seeded${NC}"

cd ..

echo ""
echo "Step 3: Setting up Frontend..."
cd frontend

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
fi

# Install dependencies
echo "Installing Node dependencies..."
npm install --silent
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""
echo "====================================="
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "====================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit backend/.env and add your AI API keys:"
echo "   - GEMINI_API_KEY or OPENAI_API_KEY"
echo "   - SECRET_KEY (use a random string)"
echo ""
echo "2. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python main.py"
echo ""
echo "3. In another terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "API Documentation: http://localhost:8000/docs"
echo ""
