# SriCart

Full Stack Shopping Application

## Tech Stack

Frontend:
- React + Vite

Backend:
- FastAPI
- SQLite
- SQLAlchemy
- Alembic
- JWT Authentication
- Role-Based Access Control

## Setup

### Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev
