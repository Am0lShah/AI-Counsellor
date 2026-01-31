# AI Counsellor MVP - Study Abroad Planning System

A complete, working MVP of a stage-based, AI-powered guided decision system for study-abroad planning.

## 🎯 Project Overview

**AI Counsellor** is a full-stack web application that guides students through their study-abroad journey using a strict, stage-based flow powered by AI recommendations.

### Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **AI**: Gemini / OpenAI (configurable)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker (for PostgreSQL) OR PostgreSQL installed locally
- Gemini API Key or OpenAI API Key

### 1. Database Setup

**Option A: Using Docker (Recommended)**

```bash
# From project root
docker-compose up -d
```

**Option B: Local PostgreSQL**

```bash
# Create database
createdb ai_counsellor

# Update DATABASE_URL in backend/.env
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Edit .env and add your API keys:
# - SECRET_KEY (generate a random string)
# - GEMINI_API_KEY or OPENAI_API_KEY
# - DATABASE_URL (if not using Docker default)

# Run migrations (create tables)
python -c "from database import init_db; init_db()"

# Seed university data
python utils/seed_data.py

# Start backend server
python main.py
```

Backend will run at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at `http://localhost:3000`

## 📖 User Flow

1. **Landing Page** → Sign up or login
2. **Authentication** → Create account with email/password
3. **Mandatory Onboarding** (4 Steps):
   - Academic Background (education, GPA, degree)
   - Study Goals (intended degree, field, countries, intake year)
   - Budget Planning (range, funding type)
   - Exams & SOP Status (IELTS, GRE, GMAT, SOP readiness)
4. **Dashboard** → View profile strength, current stage, and tasks
5. **AI Counsellor** → Chat for personalized recommendations
6. **University Discovery** → AI recommends Dream/Target/Safe universities
7. **University Shortlisting** → Save interesting universities
8. **University Locking** → Commit to final choices (enables application guidance)
9. **Application Guidance** → Get tasks, deadlines, and document checklists

## 🎨 Features

### Stage-Based Flow (Enforced)
- Stage 1: Profile Building
- Stage 2: University Discovery
- Stage 3: University Finalization
- Stage 4: Application Preparation

### AI Counsellor
- Context-aware conversations
- Understands user profile, current stage, and goals
- Can execute actions:
  - Shortlist universities
  - Lock universities
  - Create todos
- Provides Dream/Target/Safe categorization

### University Recommendations
- 20 pre-seeded universities across USA, UK, Canada, Australia, Germany
- AI-powered fit analysis
- Acceptance likelihood calculation
- Risk factor identification
- Cost and budget matching

### Profile Strength Analysis
- Academic strength (based on GPA)
- Exam readiness (IELTS, GRE, GMAT)
- SOP status
- Overall score (0-100)

### University Locking System
- Must shortlist before locking
- Locking enables application guidance
- Warning before unlocking (resets strategy)

## 🗂️ Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI app entry
│   ├── config.py               # Configuration
│   ├── database.py             # Database setup
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── routes/                 # API endpoints
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   ├── profile_service.py
│   │   ├── ai_service.py
│   │   └── recommendation_service.py
│   └── utils/
│       ├── dependencies.py     # Auth middleware
│       └── seed_data.py        # Database seeder
│
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js
│   │   ├── page.js             # Landing
│   │   ├── signup/
│   │   ├── login/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── counsellor/         # AI chat
│   │   └── universities/
│   ├── components/
│   │   ├── AuthProvider.js
│   │   ├── ProtectedRoute.js
│   │   ├── StageIndicator.js
│   │   ├── ProfileStrength.js
│   │   ├── UniversityCard.js
│   │   └── TodoList.js
│   └── lib/
│       └── api.js              # API client
│
└── docker-compose.yml          # PostgreSQL container
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Onboarding
- `POST /api/onboarding` - Submit/update onboarding
- `GET /api/onboarding` - Get onboarding data
- `GET /api/onboarding/status` - Check completion

### Dashboard
- `GET /api/dashboard` - Get profile, stage, todos

### Universities
- `GET /api/universities/discover` - Browse universities
- `GET /api/universities/recommendations` - AI recommendations
- `POST /api/universities/shortlist` - Shortlist university
- `GET /api/universities/shortlisted` - Get shortlist
- `POST /api/universities/lock` - Lock university
- `GET /api/universities/locked` - Get locked
- `POST /api/universities/unlock/{id}` - Unlock
- `DELETE /api/universities/remove/{id}` - Remove

### AI Counsellor
- `POST /api/counsellor/chat` - Send message to AI
- `GET /api/counsellor/history` - Get chat history

### Todos
- `POST /api/todos` - Create todo
- `GET /api/todos` - List todos
- `PATCH /api/todos/{id}` - Update todo
- `POST /api/todos/{id}/complete` - Mark complete
- `DELETE /api/todos/{id}` - Delete todo

## 🧠 AI Prompting System

The AI Counsellor uses context-aware prompting:

1. **User Context**: Profile, exams, goals, budget
2. **Stage Context**: Current stage and stage rules
3. **University Context**: Shortlisted and locked universities
4. **Action Detection**: Extracts structured actions from responses
5. **Execution**: Automatically executes detected actions

## 🎬 Demo Flow (3-5 minutes)

1. Show landing page (15s)
2. Sign up quickly (20s)
3. Complete onboarding (60s)
4. Show dashboard with profile analysis (20s)
5. Chat with AI → get recommendations (45s)
6. Shortlist 2-3 universities (30s)
7. Lock one university (15s)
8. Show application guidance unlocked (20s)
9. Show generated todos (15s)
10. Edit profile → show updated recommendations (20s)

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_counsellor
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
AI_SERVICE=gemini  # or openai
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🐛 Troubleshooting

**Database connection error:**
```bash
# Check if PostgreSQL is running
docker ps  # Should show ai_counsellor_db

# Restart if needed
docker-compose restart
```

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

**Frontend errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**AI not responding:**
- Check API key in backend/.env
- Verify AI_SERVICE is set correctly (gemini or openai)
- Check backend logs for errors

## 📝 Notes

- **Seed Data**: 20 universities pre-loaded across multiple countries
- **Stage Flow**: Strictly enforced - cannot skip stages
- **Onboarding**: Blocks all features until completed
- **University Locking**:Required for application guidance
- **AI Actions**: Automatically executed (shortlist, lock, create todos)

## 🚧 Production Deployment

For production:
1. Set strong SECRET_KEY
2. Use production PostgreSQL database
3. Enable HTTPS
4. Set proper CORS origins
5. Use environment-specific API keys
6. Add rate limiting
7. Implement proper error handling and logging

## 📄 License

Built as MVP demonstration. Customize as needed.

---

**Built with ❤️ using Next.js, FastAPI, and AI**
