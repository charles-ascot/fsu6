# fsu6

FSU6 — Lay Engine Intelligence Ingest + Performance Dashboard

## Structure
- `backend/` → Python/FastAPI → deployed to Cloud Run (`fsu6-lay-intelligence`)
- `frontend/` → React/Vite → deployed to Cloudflare Pages

---

## Cloud Run — Environment Variables

Set via `--set-env-vars` in `cloudbuild.yaml` (or manually in the Cloud Run console):

| Variable | Value | Notes |
|---|---|---|
| `GOOGLE_CLOUD_PROJECT` | `chimera-v4` | Set automatically by `cloudbuild.yaml` |

> The backend reads all other credentials from **Google Secret Manager** at runtime — no additional env vars needed on the Cloud Run service.

---

## Cloud Run — GCP Infrastructure

| Resource | Value |
|---|---|
| Project | `chimera-v4` |
| Region | `europe-west2` |
| Service name | `fsu6-lay-intelligence` |
| Service account | `fsu6-150@chimera-v4.iam.gserviceaccount.com` |
| Container image | `gcr.io/chimera-v4/fsu6-lay-intelligence` |
| GCS bucket (raw archive) | `fsu6-lay-raw` |
| Firestore collection | `fsu6-intelligence` |

---

## GCP Secret Manager — Secrets Required

Create these secrets in the **`chimera-v4`** project before deploying:

| Secret ID | Description |
|---|---|
| `fsu6-lay-engine-api-key` | API key for the Lay Engine (`https://layengine.thync.online`) |
| `fsu6-asana-token` | Asana personal access token for pushing summaries to CHI projects |
| `chimera-api-key` | Chimera platform API key (also used by the frontend). |

The service account `fsu6-150@chimera-v4.iam.gserviceaccount.com` must have the **Secret Manager Secret Accessor** role.

---

## Cloudflare Pages — Environment Variables

Set these in the Cloudflare Pages dashboard under **Settings → Environment variables** (mark as **Encrypted**):

| Variable | Value | Notes |
|---|---|---|
| `VITE_API_KEY` | Value of `chimera-api-key` secret | Used to authenticate frontend → backend requests |
| `VITE_API_BASE` | `https://fsu6-950990732577.europe-west2.run.app` | Cloud Run backend URL |

> For local development, copy `frontend/.env.example` to `frontend/.env.local` and fill in both values.

---

## Cloud Build — Trigger Setup

The `backend/cloudbuild.yaml` expects a trigger connected to this repo. No additional substitution variables are required beyond `$COMMIT_SHA` (provided automatically by Cloud Build).
