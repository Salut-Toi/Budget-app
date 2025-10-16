from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.security import get_current_user, get_db
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionOut
from app.repositories.transaction_repo import TransactionRepository
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/transactions", tags=["transactions"])

repo = TransactionRepository()
svc = TransactionService(repo)

@router.get("", response_model=list[TransactionOut])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0, limit: int = Query(100, le=1000)
):
    rows = repo.list_for_user(db, current_user.id, skip, limit)
    out: list[TransactionOut] = []
    for t, cname in rows:
        out.append(TransactionOut(
            id=t.id, date=t.date, label=t.label, amount=float(t.amount),
            category_id=t.category_id, category_name=cname
        ))
    return out

@router.post("", response_model=TransactionOut, status_code=201)
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        t = svc.create(db, current_user.id, payload)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return TransactionOut(
        id=t.id, date=t.date, label=t.label, amount=float(t.amount),
        category_id=t.category_id, category_name=t.category.name if t.category else None
    )

@router.patch("/{id}", response_model=TransactionOut)
def update_transaction(
    id: int, payload: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t = svc.update(db, current_user.id, id, payload)
    if not t: raise HTTPException(status_code=404, detail="Not found")
    return TransactionOut(
        id=t.id, date=t.date, label=t.label, amount=float(t.amount),
        category_id=t.category_id, category_name=t.category.name if t.category else None
    )

@router.delete("/{id}", status_code=204)
def delete_transaction(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ok = svc.delete(db, current_user.id, id)
    if not ok: raise HTTPException(status_code=404, detail="Not found")
