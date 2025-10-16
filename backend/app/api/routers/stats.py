from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.security import get_current_user, get_db
from app.models.user import User
from app.schemas.stats import PieByCategoryOut, MonthlyInOutBarOut
from app.repositories.transaction_repo import TransactionRepository
from app.services.stats_service import StatsService

router = APIRouter(prefix="/stats", tags=["stats"])
svc = StatsService(TransactionRepository())

@router.get("/balance")
def get_balance(
    start: str | None = Query(None), end: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {"balance": svc.balance(db, current_user.id, start, end)}

@router.get("/expenses-by-category", response_model=PieByCategoryOut)
def expenses_by_category(
    start: str | None = Query(None), end: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rows = svc.pie_by_category(db, current_user.id, start, end)
    return {"categories": [r[0] for r in rows], "totals": [r[1] for r in rows]}

@router.get("/monthly-inout", response_model=MonthlyInOutBarOut)
def monthly_inout(
    start: str | None = Query(None), end: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rows = svc.monthly_in_out(db, current_user.id, start, end)
    return {
        "labels": [r[0] for r in rows],
        "incomes": [r[1] for r in rows],
        "expenses": [r[2] for r in rows]
    }
