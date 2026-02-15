from fastapi import FastAPI

# from sqlalchemy.orm import Session
from .database import engine, SessionLocal

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()