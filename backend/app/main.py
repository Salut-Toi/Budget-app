from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.db.init_db import init_db
from app.api.routers import transactions, stats, categories, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

app.include_router(auth.router,         prefix=settings.API_V1)
app.include_router(transactions.router, prefix=settings.API_V1)
app.include_router(stats.router,        prefix=settings.API_V1)
app.include_router(categories.router,   prefix=settings.API_V1)

@app.get("/health")
def health():
    return {"status": "ok"}
