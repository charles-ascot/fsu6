"""
Reads all required data from the Lay Engine API.
Raw data is returned exactly as received — no transformation.
"""
import httpx
import logging
from datetime import datetime, timezone
from app.core.config import LAY_ENGINE_BASE
from app.core.secrets import get_lay_engine_api_key

logger = logging.getLogger(__name__)

ENDPOINTS = {
    "summary":  "/api/data/summary",
    "sessions": "/api/data/sessions",
    "bets":     "/api/data/bets",
    "results":  "/api/data/results",
    "state":    "/api/data/state",
    "rules":    "/api/data/rules",
}


async def fetch_lay_engine() -> dict:
    """
    Fetch all intelligence data from the Lay Engine.
    Returns raw responses keyed by endpoint name.
    """
    api_key = get_lay_engine_api_key()
    headers = {"X-API-Key": api_key}

    async with httpx.AsyncClient(base_url=LAY_ENGINE_BASE, timeout=30) as client:
        results = {}
        for name, path in ENDPOINTS.items():
            try:
                response = await client.get(path, headers=headers)
                response.raise_for_status()
                results[name] = response.json()
                logger.info("Fetched %s — OK", name)
            except Exception as e:
                logger.error("Failed to fetch %s: %s", name, str(e))
                results[name] = None

    results["fetched_at"] = datetime.now(timezone.utc).isoformat()
    return results
