"""
FSU6 — Lay Engine Intelligence Ingest
Reads the Lay Engine API and exposes structured intelligence via endpoint.
Also pushes daily summaries to the correct Asana CHI projects.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import FSU_NAME, FSU_VERSION, API_VERSION
from app.routers import intelligence, health, asana_push

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s", FSU_NAME, FSU_VERSION)
    yield
    logger.info("Shutting down %s", FSU_NAME)


app = FastAPI(
    title=FSU_NAME,
    version=FSU_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(intelligence.router, prefix=f"/v{API_VERSION}")
app.include_router(asana_push.router, prefix=f"/v{API_VERSION}")
