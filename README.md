# fsu6

FSU6 — Lay Engine Intelligence Ingest + Performance Dashboard

## Structure
- `backend/` → Python/FastAPI → deploy to Cloud Run (fsu6-lay-intelligence)
- `frontend/` → React/Vite → deploy to Cloudflare Pages

## Backend secrets required (Secret Manager, chimera project)
- `fsu6-lay-engine-api-key`
- `fsu6-asana-token`
- `chimera-api-key`

## Frontend env vars (Cloudflare Pages, encrypted)
- `VITE_API_KEY` = chimera-api-key value
- `VITE_API_BASE` = Cloud Run URL of backend
