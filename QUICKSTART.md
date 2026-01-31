# AI Counsellor MVP - Quick Start Guide

## 🎯 What You Just Got

A complete, production-ready MVP of an AI-powered study-abroad planning system with:
- **Backend**: FastAPI + PostgreSQL + AI (Gemini/OpenAI)
- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Features**: Authentication, Onboarding, Dashboard, AI Chat, University Management
- **Data**: 20 pre-seeded universities

---

## ⚡ 3-Step Setup

### Step 1: Get API Keys

You need **one** of these:
- **Gemini API Key** (Recommended): https://makersuite.google.com/app/apikey
- **OpenAI API Key**: https://platform.openai.com/api-keys

### Step 2: Run Setup Script

```bash
cd "/Users/amolshah/Documents/Assign Ai"
chmod +x setup.sh
./setup.sh
```

This will:
- Start PostgreSQL (Docker)
- Setup Python virtual environment
- Install all dependencies
- Initialize database
- Seed 20 universities

### Step 3: Add Your API Key

Edit `backend/.env`:

```env
# Required: Add YOUR API key (choose one)
GEMINI_API_KEY=your-gemini-api-key-here
# OR
# OPENAI_API_KEY=your-openai-api-key-here

# Required: Set AI service
AI_SERVICE=gemini  # or 'openai'

# Required: Set a random secret key
SECRET_KEY=change-this-to-a-random-string-abc123xyz
```

---

## 🚀 Start the Application

### Terminal 1: Backend

```bash
cd backend
source venv/bin/activate
python main.py
```

✅ Backend running at: http://localhost:8000  
✅ API Docs at: http://localhost:8000/docs

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend running at: http://localhost:3000

---

## 🎬 Demo the MVP (3-5 minutes)

1. **Open** http://localhost:3000
2. **Click** "Get Started" → Sign up
3. **Complete** 4-step onboarding:
   - Academic: GPA 3.5, CS degree
   - Goals: Masters in Computer Science
   - Countries: USA, UK, Canada
   - Budget: $30k-$60k/year
   - Exams: IELTS completed (7.5), GRE in progress
4. **View** Dashboard - Profile strength: ~65/100
5. **Click** "Talk to AI Counsellor"
6. **Type**: "What universities do you recommend?"
7. **Watch** AI categorize as Dream/Target/Safe
8. **Go to** Universities → Shortlist 2-3
9. **Lock** one university
10. **Check** Dashboard - Application guidance unlocked!

---

## 📋 What Works

✅ Complete user authentication (JWT)  
✅ Mandatory onboarding (blocks everything)  
✅ Profile strength analysis (Academic/Exams/SOP)  
✅ 4-stage progression system  
✅ AI chat with action execution  
✅ University recommendations (Dream/Target/Safe)  
✅ Shortlisting and locking mechanism  
✅ Todo/task management  
✅ Profile editing with recalculation  

---

## 🔧 Troubleshooting

**"Database connection error"**
```bash
docker ps  # Check if PostgreSQL is running
docker-compose restart
```

**"AI not responding"**
- Check `backend/.env` has correct API key
- Verify `AI_SERVICE` is set correctly
- Check backend terminal for errors

**"Frontend won't start"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Key Files to Explore

### Backend
- `backend/main.py` - FastAPI app entry
- `backend/services/ai_service.py` - **AI counsellor logic**
- `backend/services/recommendation_service.py` - University categorization
- `backend/utils/seed_data.py` - 20 pre-loaded universities

### Frontend
- `frontend/app/counsellor/page.js` - **AI chat interface**
- `frontend/app/dashboard/page.js` - Control center
- `frontend/app/onboarding/page.js` - 4-step form
- `frontend/components/UniversityCard.js` - University display

---

## 🎯 Next Steps

1. **Test the flow**: Create account → Onboard → Chat with AI → Lock university
2. **Customize**: Edit university data in `backend/utils/seed_data.py`
3. **Extend**: Add more AI actions (e.g., deadline reminders, document checklist)
4. **Deploy**: Follow production checklist in README.md

---

## 📖 Full Documentation

- **README.md** - Complete setup instructions
- **walkthrough.md** - System architecture & features
- **implementation_plan.md** - Technical design decisions

---

## 💡 Pro Tips

1. **API Docs**: Visit http://localhost:8000/docs to test APIs directly
2. **Database**: Access PostgreSQL at `localhost:5432` (postgres/postgres)
3. **Logs**: Watch backend terminal for AI prompts and responses
4. **Seed Data**: Run `python utils/seed_data.py` to reset universities
5. **Clean Start**: `docker-compose down -v` to wipe database

---

## 🆘 Need Help?

Check these files:
- [README.md](file:///Users/amolshah/Documents/Assign%20Ai/README.md) - Detailed setup
- [walkthrough.md](file:///Users/amolshah/.gemini/antigravity/brain/ab40c4da-71dc-49b1-b1ef-8df2c4f0bc11/walkthrough.md) - Feature overview
- [implementation_plan.md](file:///Users/amolshah/.gemini/antigravity/brain/ab40c4da-71dc-49b1-b1ef-8df2c4f0bc11/implementation_plan.md) - Technical details

---

**You're all set! Start the backend and frontend, then open http://localhost:3000** 🚀
