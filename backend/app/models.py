from .database import Base
from sqlalchemy import *
from sqlalchemy.orm import relationship
from datetime import datetime

#association table
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("role_id", Integer, ForeignKey("roles.id"))
)

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    name = Column(String)
    email = Column(String, unique=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    update_at = Column(DateTime, default=datetime.now)

    # role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", secondary=user_roles, backref="users")