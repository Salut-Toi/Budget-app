from sqlalchemy.orm import Session
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.repositories.transaction_repo import TransactionRepository

class TransactionService:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def create(self, db: Session, user_id: int, payload: TransactionCreate):
        if not payload.label.strip():
            raise ValueError("Label requis")
        if not payload.amount or payload.amount == 0:
            raise ValueError("Montant non nul requis")
        return self.repo.create(db, user_id=user_id, **payload.model_dump())

    def update(self, db: Session, user_id: int, id: int, payload: TransactionUpdate):
        obj = self.repo.get(db, id)
        if not obj or obj.user_id != user_id:
            return None
        return self.repo.update(db, obj, **payload.model_dump(exclude_unset=True))

    def delete(self, db: Session, user_id: int, id: int) -> bool:
        obj = self.repo.get(db, id)
        if not obj or obj.user_id != user_id:
            return False
        self.repo.delete(db, obj)
        return True
