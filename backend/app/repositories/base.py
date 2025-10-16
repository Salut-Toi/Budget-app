from typing import Generic, TypeVar, Type
from sqlalchemy.orm import Session

ModelT = TypeVar("ModelT")

class Repository(Generic[ModelT]):
    def __init__(self, model: Type[ModelT]):
        self.model = model

    def get(self, db: Session, id: int):
        return db.get(self.model, id)

    def create(self, db: Session, **obj_in):
        obj = self.model(**obj_in)
        db.add(obj); db.commit(); db.refresh(obj)
        return obj

    def update(self, db: Session, db_obj: ModelT, **obj_in):
        for f, v in obj_in.items():
            if v is not None:
                setattr(db_obj, f, v)
        db.commit(); db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, db_obj: ModelT):
        db.delete(db_obj); db.commit()
