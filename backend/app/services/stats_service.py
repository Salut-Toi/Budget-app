from sqlalchemy.orm import Session
from app.repositories.transaction_repo import TransactionRepository

class StatsService:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def balance(self, db: Session, user_id: int, start=None, end=None) -> float:
        return self.repo.balance(db, user_id, start, end)

    def pie_by_category(self, db: Session, user_id: int, start=None, end=None):
        return self.repo.expenses_by_category(db, user_id, start, end)

    def monthly_in_out(self, db: Session, user_id: int, start=None, end=None):
        return self.repo.monthly_in_out(db, user_id, start, end)
