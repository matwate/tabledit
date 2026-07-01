# Minimal FastAPI Template

Stub routes: `GET /health`, `GET/POST/PUT/PATCH/DELETE /items`.
SQLite-backed via a tiny `Database` wrapper.

## Run

```bash
uv sync
uv run uvicorn main:app --reload
```

