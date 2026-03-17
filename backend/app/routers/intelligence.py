"""
GET /v1/intelligence — the single FSU6 endpoint.
Returns structured Lay Engine intelligence.
The dashboard and AI Conductor call this.
"""
from fastapi import APIRouter, Header, HTTPException, Query
from app.core.secrets import get_chimera_api_key
from app.services.lay_engine_service import fetch_lay_engine
from app.services.storage_service import archive_snapshot
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


@router.get("/intelligence")
async def get_intelligence(
    archive: bool = Query(False, description="Archive raw snapshot to GCS"),
    x_chimera_api_key: str = Header(None),
):
    """
    Read all Lay Engine data and return structured intelligence.
    This is the single FSU6 endpoint — one source, one output.
    """
    _require_key(x_chimera_api_key)

    data = await fetch_lay_engine()

    if archive:
        try:
            gcs_path = archive_snapshot(data)
            data["_archived_to"] = gcs_path
        except Exception as e:
            logger.warning("GCS archive failed: %s", str(e))

    return data
