from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Budget API"
    API_V1: str = "/api/v1"
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./budget.db"
    CORS_ORIGINS: list[str] = ["http://localhost:4200", "http://127.0.0.1:4200"]

    JWT_SECRET: str = "change-me"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    ADMIN_USER: str = "admin"
    ADMIN_PASS: str = "admin"

    class Config:
        env_file = ".env"

settings = Settings()
