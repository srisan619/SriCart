from .database import Base
from sqlalchemy import *
from sqlalchemy.orm import relationship
from datetime import datetime

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    name = Column(String)
    email = Column(String, unique=True)
    active = Column(Boolean, default="Y")
    created_at = Column(DateTime, default=datetime.now)
    update_at = Column(DateTime, default=datetime.now)

    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role")