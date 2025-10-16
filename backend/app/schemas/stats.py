from pydantic import BaseModel

class PieByCategoryOut(BaseModel):
    categories: list[str]
    totals: list[float]

class MonthlyInOutBarOut(BaseModel):
    labels: list[str]     # "YYYY-MM"
    incomes: list[float]
    expenses: list[float]
