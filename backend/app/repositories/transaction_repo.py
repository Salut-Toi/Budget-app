from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from app.models.category import Category
from .base import Repository

class TransactionRepository(Repository[Transaction]):
    def __init__(self):
        super().__init__(Transaction)

    def list_for_user(self, db: Session, user_id: int, skip=0, limit=100):
        q = (
            db.query(Transaction, Category.name.label("category_name"))
            .outerjoin(Category, Transaction.category_id == Category.id)
            .filter(Transaction.user_id == user_id)
            .offset(skip).limit(limit)
        )
        return q.all()

    def balance(self, db: Session, user_id: int, start=None, end=None) -> float:
        q = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(Transaction.user_id == user_id)
        if start: q = q.filter(Transaction.date >= start)
        if end:   q = q.filter(Transaction.date <= end)
        return float(q.scalar() or 0.0)

    def expenses_by_category(self, db: Session, user_id: int, start=None, end=None):
        q = (
            db.query(Category.name, func.sum(Transaction.amount).label("total"))
            .join(Category, Transaction.category_id == Category.id)
            .filter(Transaction.user_id == user_id, Transaction.amount < 0)
        )
        if start: q = q.filter(Transaction.date >= start)
        if end:   q = q.filter(Transaction.date <= end)
        rows = q.group_by(Category.name).all()
        return [(name, float(abs(total))) for name, total in rows]

    def monthly_in_out(self, db: Session, user_id: int, start=None, end=None):
        period = func.strftime("%Y-%m", Transaction.date)  # SQLite
        q = (
            db.query(
                period.label("period"),
                func.sum(func.case((Transaction.amount > 0, Transaction.amount), else_=0)).label("income"),
                func.sum(func.case((Transaction.amount < 0, -Transaction.amount), else_=0)).label("expense"),
            )
            .filter(Transaction.user_id == user_id)
        )
        if start: q = q.filter(Transaction.date >= start)
        if end:   q = q.filter(Transaction.date <= end)
        q = q.group_by(period).order_by(period)
        return [(p, float(i or 0), float(e or 0)) for p, i, e in q.all()]
