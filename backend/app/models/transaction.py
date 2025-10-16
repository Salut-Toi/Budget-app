from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Date, Numeric, CheckConstraint, text
from app.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(Date, server_default=text("CURRENT_DATE"))
    label: Mapped[str] = mapped_column(String(200), index=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    category = relationship("Category", back_populates="transactions")
    user = relationship("User", back_populates="transactions")

    __table_args__ = (CheckConstraint("amount <> 0", name="ck_amount_nonzero"),)
