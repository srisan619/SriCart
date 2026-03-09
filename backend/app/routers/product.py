from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
import os
import shutil

from app.dependencies import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate,ProductUpdate,ProductResponse
from app.crud import product as crud_product

router = APIRouter(prefix="/products", tags=["Products"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("", response_model=ProductResponse)
def create_product(
    name: str = Form(...),
    description: str = Form(None),
    product_type_id: int = Form(...),
    available_qty: int = Form(...),
    price: float = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
    ):
    image_name = None
    if image:
        image_name = image.filename
        file_path = os.path.join(UPLOAD_FOLDER, image_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    product_data = ProductCreate(
        name=name,
        description = description,
        product_type_id=product_type_id,
        available_qty=available_qty,
        price=price
    )

    product = crud_product.create_product(db, product_data, image_name)
    return product

@router.get("", response_model=list[ProductResponse])
def get_products(db: Session=Depends(get_db)):
    return crud_product.get_products(db)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(None),
    product_type_id: int = Form(...),
    available_qty: int = Form(...),
    price: float = Form(...),
    image: UploadFile = File(None),
    db: Session=Depends(get_db)
    ):
    
    product = crud_product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    image_name = None
    if image:
        image_name = image.filename
        file_path = os.path.join(UPLOAD_FOLDER, image_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    product_data = ProductUpdate(
        name=name,
        description = description,
        product_type_id=product_type_id,
        available_qty=available_qty,
        price=price
    )

    return crud_product.update_product(db, product, product_data, image_name )


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session=Depends(get_db)):
    product = crud_product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud_product.delete_product(db, product)
    return {"message": "Product deleted successfully."}