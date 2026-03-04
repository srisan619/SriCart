from .product import ProductBase,ProductCreate,ProductUpdate,ProductResponse
from .product_type import ProductTypeBase,ProductTypeCreate,ProductTypeResponse

from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    email: EmailStr
    active: bool

class UserLogin(BaseModel):
    username: str
    password: str

class RoleCreate(BaseModel):
    name: str

class RoleResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str
    active: bool
    created_at: datetime
    update_at: datetime
    roles: list[RoleResponse]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


