from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import *
from app.database import Base

class Product(Base):
    __tablename__ ="products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    product_type_id = Column(
        Integer,
        ForeignKey("product_types.id", name="fk_products_product_type_id"),
        nullable=False
    )
    image = Column(String(255), nullable=True)
    available_qty = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    product_type = relationship("ProductType", back_populates="products")