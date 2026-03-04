from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class ProductType(Base):
    __tablename__ = "product_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    products = relationship("Product", back_populates="product_type")