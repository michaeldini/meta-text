from fastapi import APIRouter, Request
from pydantic import BaseModel
from loguru import logger

router = APIRouter()

class FrontendLog(BaseModel):
    level: str
    message: str
    context: dict | None = None

@router.post("/frontend-log")
async def frontend_log(log: FrontendLog, request: Request):
    client_host = request.client.host if request.client else "unknown"
    log_message = f"[FRONTEND] [{client_host}] {log.message}"
    if log.level.lower() == "error":
        logger.error(log_message)
    elif log.level.lower() == "warn":
        logger.warning(log_message)
    elif log.level.lower() == "info":
        logger.info(log_message)
    elif log.level.lower() == "debug":
        logger.debug(log_message)
    else:
        logger.info(log_message)
    return {"status": "ok"}
