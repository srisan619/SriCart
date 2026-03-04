from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.product_type import ProductTypeCreate, ProductTypeResponse
from app.crud import product_type as crud_product_type

router = APIRouter(prefix="/product-types", tags=["Product Types"])


@router.post("/", response_model=ProductTypeResponse)
def create_product_type(data: ProductTypeCreate, db: Session = Depends(get_db)):
    return crud_product_type.create_product_type(db, data)


@router.get("/", response_model=list[ProductTypeResponse])
def get_product_types(db: Session = Depends(get_db)):
    return crud_product_type.get_product_types(db)