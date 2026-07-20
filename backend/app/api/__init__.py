from fastapi import APIRouter
from app.api.predictions import router as predictions_router
from app.api.live import router as live_router
from app.api.historical import router as historical_router
from app.api.alerts import router as alerts_router

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "healthy"}

router.include_router(predictions_router, tags=["predictions"])
router.include_router(live_router, tags=["live"])
router.include_router(historical_router, tags=["historical"])
router.include_router(alerts_router, tags=["alerts"])
