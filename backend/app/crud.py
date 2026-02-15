from sqlalchemy.orm import Session
from .models import User
from .auth import hash_password

def create_user(db: Session, user):
    db_user = User(
        username = user.username,
        password = hash_password(user.password),
        name = user.name,
        email = user.email
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_all_users(db: Session):
    return db.query(User).all()