"""
Archives raw Lay Engine snapshots to GCS.
Raw data lands untouched — no transformation.
"""
import json
import logging
from datetime import datetime, timezone
from google.cloud import storage
from app.core.config import GCS_BUCKET

logger = logging.getLogger(__name__)


def archive_snapshot(data: dict) -> str:
    """Write raw snapshot to GCS. Returns the GCS path."""
    client = storage.Client()
    bucket = client.bucket(GCS_BUCKET)

    ts = datetime.now(timezone.utc)
    path = f"raw/{ts.strftime('%Y/%m/%d')}/snapshot_{ts.strftime('%H%M%S')}.json"

    blob = bucket.blob(path)
    blob.upload_from_string(
        json.dumps(data, default=str),
        content_type="application/json",
    )
    logger.info("Archived snapshot to gs://%s/%s", GCS_BUCKET, path)
    return f"gs://{GCS_BUCKET}/{path}"
