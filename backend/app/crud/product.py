from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

def create_product(db: Session, product_data: ProductCreate, image_name: str | None):
    product = Product(
        name=product_data.name,
        description = product_data.description,
        product_type_id=product_data.product_type_id,
        available_qty=product_data.available_qty,
        price=product_data.price,
        image=image_name
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_products(db: Session):
    return db.query(Product).all()

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def update_product(db: Session, product: Product, product_data: ProductUpdate, image_name: str|None):
    product.name = product_data.name
    product.description = product_data.description
    product.product_type_id=product_data.product_type_id
    product.available_qty=product_data.available_qty
    product.price=product_data.price

    if image_name:
        product.image=image_name
    
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session,  product: Product):
    db.delete(product)
    db.commit()