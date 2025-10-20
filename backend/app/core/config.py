from __future__ import annotations

import json
from typing import List, Any

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Pydantic v2 config
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    PROJECT_NAME: str = "Budget API"
    API_V1: str = "/api/v1"

    # SQLite par défaut ; surcharge possible via .env
    # Exemple .env : SQLALCHEMY_DATABASE_URI=sqlite:///./budget.db
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./budget.db"

    # CORS : accepte soit un JSON '["http://x","http://y"]', soit "http://x,http://y"
    CORS_ORIGINS: List[str] = ["http://localhost:4200", "http://127.0.0.1:4200"]

    # JWT
    JWT_SECRET: str = "change-me"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 jours

    # Admin seed
    ADMIN_USER: str = "admin"
    ADMIN_PASS: str = "admin"  # ⚠️ sera validé (<= 72 octets pour bcrypt)

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> Any:
        """
        Autorise :
        - JSON string: '["http://a","http://b"]'
        - CSV string:  'http://a,http://b'
        - Liste Python classique
        """
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v_strip = v.strip()
            # JSON ?
            if v_strip.startswith("[") and v_strip.endswith("]"):
                try:
                    parsed = json.loads(v_strip)
                    if isinstance(parsed, list):
                        return parsed
                except json.JSONDecodeError:
                    pass
            # CSV fallback
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    @field_validator("ADMIN_PASS")
    @classmethod
    def validate_admin_pass_len(cls, v: str) -> str:
        """
        Bcrypt limite à 72 octets. Passlib déclenche une ValueError si > 72.
        On valide ici pour donner un message clair au démarrage.
        """
        if len(v.encode("utf-8")) > 72:
            raise ValueError("ADMIN_PASS dépasse 72 octets (limite bcrypt) — raccourcis-le dans ton .env.")
        return v


settings = Settings()
