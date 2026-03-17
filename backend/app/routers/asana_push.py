"""
POST /v1/push-asana — triggers Asana task creation across all CHI projects.
Called by Cloud Scheduler twice daily.
"""
from fastapi import APIRouter, Header, HTTPException
from app.core.secrets import get_chimera_api_key
from app.services.lay_engine_service import fetch_lay_engine
from app.services.asana_service import push_all
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_key(x_chimera_api_key: str = None):
    try:
        expected = get_chimera_api_key()
    except Exception:
        raise HTTPException(status_code=500, detail="Secret Manager unavailable")
    if x_chimera_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")


@router.post("/push-asana")
async def push_to_asana(x_chimera_api_key: str = Header(None)):
    """
    Fetch latest Lay Engine data and push summaries to Asana CHI projects.
    Triggered by Cloud Scheduler — morning and end of day.
    """
    _require_key(x_chimera_api_key)

    logger.info("Fetching Lay Engine data for Asana push...")
    data = await fetch_lay_engine()

    logger.info("Pushing to Asana CHI projects...")
    results = await push_all(data)

    pushed = sum(1 for v in results.values() if "error" not in v)
    failed = sum(1 for v in results.values() if "error" in v)

    return {
        "status": "complete",
        "pushed": pushed,
        "failed": failed,
        "results": results,
    }
