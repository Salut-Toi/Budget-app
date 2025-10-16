from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User
from app.models.category import Category

DEFAULT_CATEGORIES = ["Logement", "Alimentation", "Transport", "Loisirs", "Santé", "Salaire", "Autre"]

def init_db(db: Session):
    # Seed user
    if not db.query(User).first():
        user = User(
            username=settings.ADMIN_USER,
            hashed_password=hash_password(settings.ADMIN_PASS),
            is_active=True,
        )
        db.add(user); db.commit()

    # Seed categories
    if not db.query(Category).first():
        for name in DEFAULT_CATEGORIES:
            db.add(Category(name=name))
        db.commit()
