from .database import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .auth import SECRET_KEY, ALGORITHM
from jose import JWTError, jwt
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

def require_roles(required_roles: list[str]):
    def role_checker(current_user: User=Depends(get_current_user)):
        user_roles = [ role.name for role in current_user.roles]

        for role in require_roles:
            if role in user_roles:
                return current_user
        
        raise HTTPException(status_code=403, detail="Permission denied")
    return role_checker