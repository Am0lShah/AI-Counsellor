# 🎓 AI Counsellor

> **Your intelligent companion for the study-abroad journey.**  
> *Plan, Shortlist, and Apply to your dream universities with AI-powered guidance.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://claritycounsellor.netlify.app/)
[![Watch Demo](https://img.shields.io/badge/Watch%20Demo-Video%20Walkthrough-red?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/1LPlGecSm_MCqqG6kkf5wJ-U89kE-8Gz7/view?usp=sharing)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🚀 Project Overview

**AI Counsellor** is a cutting-edge, full-stack web application designed to democratize study-abroad counseling. It replaces expensive consultants with an **intelligent, context-aware AI** that guides students through every step of their journey—from profile building to university shortlisting and final application submission.

Unlike generic chatbots, AI Counsellor operates on a **strict, stage-based framework** ensuring students follow a proven roadmap to success.

### ✨ Key Features

*   **🧠 Intelligent AI Agent**: powered by Google Gemini (or OpenAI), context-aware of your profile, budget, and goals.
*   **📊 Smart Profile Analysis**: Calculates your "Profile Strength" based on GPA, test scores (IELTS/GRE), and SOP readiness.
*   **🎯 Dream / Target / Safe Sorting**: AI automatically categorizes universities based on your acceptance chances.
*   **🔒 Stage-Based Progression**: 
    1.  **Profile Building**: Focus on exams and documents.
    2.  **University Discovery**: explore and shortlist options.
    3.  **Finalization**: "Lock" your choices to commit.
    4.  **Application**: track deadlines and rigorous tasks.
*   **✅ Automated Task Management**: The AI automatically creates and manages your To-Do list based on your conversations.

---

## 🛠️ Tech Stack

This project is built with a modern, scalable, and type-safe stack:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) | App Router, Server Components, Static Export |
| **UI / UX** | [Tailwind CSS](https://tailwindcss.com/) | Responsive, modern, glassmorphic design |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance Python API |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational data persistence |
| **ORM** | [SQLAlchemy](https://www.sqlalchemy.org/) | Python SQL toolkit and ORM |
| **AI Engine** | [Google Gemini](https://deepmind.google/technologies/gemini/) | Generative AI model for reasoning and logic |
| **Deployment**| Netlify (Frontend) + Render (Backend) | CI/CD Pipeline |

---

## 📸 Screenshots

| Dashboard | AI Chat |
| :---: | :---: |
| ![Dashboard Mockup](https://via.placeholder.com/600x400?text=Dashboard+View) | ![Chat Mockup](https://via.placeholder.com/600x400?text=AI+Chat+Interface) |

| University Discovery | Profile Analytics |
| :---: | :---: |
| ![Universities Mockup](https://via.placeholder.com/600x400?text=University+Finder) | ![Profile Mockup](https://via.placeholder.com/600x400?text=Profile+Analytics) |

*(Note: Screenshots to be updated)*

---

## ⚡ Quick Start

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js 18+
*   Python 3.11+
*   PostgreSQL (or Docker)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment
cp .env.example .env
# Update .env with your DATABASE_URL and GEMINI_API_KEY

# Initialize Database
python -c "from database import init_db; init_db()"
python utils/seed_data.py  # (Optional) Add dummy universities

# Run Server
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure Environment
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Run Dev Server
npm run dev
```

Visit `http://localhost:3000` to see the app!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📬 Contact

**Amol Shah**  
- [GitHub](https://github.com/Am0lShah)
- [LinkedIn](https://linkedin.com/in/Am0lShah) (Update with actual link if available)

---

<center>Built with ❤️ and ☕ by Amol Shah</center>
