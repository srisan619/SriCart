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

curl.exe -s -X POST http://127.0.0.1:8000/login -H "Content-Type: application/json" -d "{\`"username\`":\`"admin\`",\`"password\`":\`"admin\`"}"
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc3MTk2NjE3Mn0.y3FjP_JEwNd2I0neCjLf4vXQtGXIZYwYHtWXDj_UR2s","token_type":"bearer"}
