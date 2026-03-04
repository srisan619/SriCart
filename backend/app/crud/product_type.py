from sqlalchemy.orm import Session
from app.models.product_type import ProductType
from app.schemas.product_type import ProductTypeCreate


def create_product_type(db: Session, data: ProductTypeCreate):
    product_type = ProductType(name=data.name)
    db.add(product_type)
    db.commit()
    db.refresh(product_type)
    return product_type


def get_product_types(db: Session):
    return db.query(ProductType).all()