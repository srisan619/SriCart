from sqlalchemy.orm import Session
from .models import User, Role, BlacklistedToken
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

def get_user_by_id(db, user_id: str):
    return db.query(User).filter(User.id==user_id).first()

def get_all_users(db: Session):
    return db.query(User).all()

def create_role(db, role_name: str):
    role = Role(name=role_name)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def get_all_roles(db):
    return db.query(Role).all()

def get_role_by_id(db, role_id: str):
    return db.query(Role).filter(Role.id==role_id).first()

def get_role_by_name(db, name: str):
    return db.query(Role).filter(Role.name == name).first()

def update_role(db, role_id: int, new_name: str):
    role = get_role_by_id(db, role_id)
    if role:
        role.name = new_name
        db.commit()
        db.refresh(role)
    return role

def update_user(db, user_id: int, name: str, email: str):
    user = get_user_by_id(db, user_id)
    if user:
        user.name = name
        user.email = email
        db.commit()
        db.refresh(user)
    return user

def delete_role(db, role_id: int):
    role = get_role_by_id(db, role_id)
    if role:
        db.delete(role)
        db.commit()
    return role

def assign_role_to_user(db, user: User, role: Role):
    user.roles.append(role)
    db.commit()
    db.refresh(user)
    return user

def blacklist_token(db, token: str):
    db_token = BlacklistedToken(token=token)
    db.add(db_token)
    db.commit()
    
def is_token_blacklisted(db, token: str):
    return db.query(BlacklistedToken).filter(
        BlacklistedToken.token == token
    ).first() is not None