# Budget API (FastAPI + SQLite + JWT)

API REST pour une application de gestion de budget, prête à l'emploi avec :
- **FastAPI**
- **SQLite** (dev)
- **JWT auth** (login + /auth/me)
- **Transactions** CRUD associées à l'utilisateur
- **Stats** (solde, dépenses par catégorie, revenus/dépenses mensuels)
- **CORS** configuré pour Angular (localhost:4200)

## Démarrage rapide

```bash
python -m venv .venv
source .venv/bin/activate  # sous Windows: .venv\Scripts\activate
pip install -U pip
pip install -e .
uvicorn app.main:app --reload
```

- Connexion par défaut: `admin / admin` (modifiez dans `.env`).
- Base URL: `http://localhost:8000/api/v1`.

## Endpoints principaux

- `POST /api/v1/auth/login` (form-urlencoded: username, password)
- `GET  /api/v1/auth/me`
- `GET  /api/v1/transactions`
- `POST /api/v1/transactions`
- `PATCH /api/v1/transactions/{id}`
- `DELETE /api/v1/transactions/{id}`
- `GET  /api/v1/stats/balance?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET  /api/v1/stats/expenses-by-category`
- `GET  /api/v1/stats/monthly-inout`
- `GET  /health`

## Variables d'environnement

Copiez `.env.example` en `.env` et adaptez :
```env
# .env
CORS_ORIGINS=["http://localhost:4200","http://127.0.0.1:4200"]
SQLALCHEMY_DATABASE_URI=sqlite:///./budget.db
JWT_SECRET=remplacez-moi
ADMIN_USER=admin
ADMIN_PASS=admin
```

## Notes

- Pour PostgreSQL ultérieurement, remplacez `SQLALCHEMY_DATABASE_URI` et adaptez l'agrégation (strftime -> to_char).
- Pensez à passer sur Alembic pour gérer les migrations en production.
