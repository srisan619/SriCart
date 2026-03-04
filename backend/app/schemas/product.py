from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    product_type_id: int
    available_qty: int
    price: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    image: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class config:
        from_attributes = True