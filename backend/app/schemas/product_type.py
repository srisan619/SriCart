from pydantic import BaseModel


class ProductTypeBase(BaseModel):
    name: str


class ProductTypeCreate(ProductTypeBase):
    pass


class ProductTypeResponse(ProductTypeBase):
    id: int

    class Config:
        from_attributes = True