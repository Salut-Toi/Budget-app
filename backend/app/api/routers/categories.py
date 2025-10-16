from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import get_current_user, get_db
from app.models.user import User
from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=list[str])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [c.name for c in db.query(Category).order_by(Category.name).all()]
