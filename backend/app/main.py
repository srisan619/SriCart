from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import engine, Base
from . import models, schemas, crud
from .auth import create_access_token, verify_password
from .dependencies import get_db

Base.metadata.create_all(bind=engine)
app = FastAPI(title="SriCart API")

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="username already exists")
    return crud.create_user(db, user)

@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(user.username)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user.username})

    return{
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/users", response_model=list[schemas.UserResponse])
def list_users(db: Session=Depends(get_db)):
    return crud.get_all_users(db)