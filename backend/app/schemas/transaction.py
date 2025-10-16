from pydantic import BaseModel, Field
from datetime import date

class TransactionBase(BaseModel):
    date: date
    label: str = Field(max_length=200)
    amount: float
    category_id: int | None = None

class TransactionCreate(TransactionBase): pass

class TransactionUpdate(BaseModel):
    date: date | None = None
    label: str | None = None
    amount: float | None = None
    category_id: int | None = None

class TransactionOut(TransactionBase):
    id: int
    category_name: str | None = None
