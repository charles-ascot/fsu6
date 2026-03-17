"""
Load secrets from Google Secret Manager.
All credentials live here — never in environment variables.
"""
from google.cloud import secretmanager
from app.core.config import GCP_PROJECT
import logging

logger = logging.getLogger(__name__)
_cache = {}


def get_secret(secret_id: str) -> str:
    if secret_id in _cache:
        return _cache[secret_id]
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{GCP_PROJECT}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    value = response.payload.data.decode("UTF-8").strip()
    _cache[secret_id] = value
    logger.info("Loaded secret: %s", secret_id)
    return value


def get_lay_engine_api_key() -> str:
    return get_secret("fsu6-lay-engine-api-key")


def get_asana_token() -> str:
    return get_secret("fsu6-asana-token")


def get_chimera_api_key() -> str:
    return get_secret("chimera-api-key")
