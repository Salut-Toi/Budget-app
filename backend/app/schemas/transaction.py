from datetime import date
from typing import Optional
from pydantic import BaseModel


# Base commune à toutes les transactions
class TransactionBase(BaseModel):
    date: date
    label: str
    amount: float
    category_id: int


# Modèle pour la création d'une transaction
class TransactionCreate(TransactionBase):
    pass


# Modèle pour la mise à jour (tous les champs optionnels)
class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    label: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None


# Modèle pour la réponse / affichage
class TransactionOut(TransactionBase):
    id: int

    class Config:
        orm_mode = True
