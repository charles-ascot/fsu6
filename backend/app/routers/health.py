from fastapi import APIRouter
from app.core.config import FSU_NAME, FSU_VERSION

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "fsu": FSU_NAME, "version": FSU_VERSION}

@router.get("/version")
def version():
    return {"fsu": FSU_NAME, "version": FSU_VERSION}
