from fastapi import APIRouter
from app.api.calendar import router as calendar_router

api_router = APIRouter()

# Include calendar routes
api_router.include_router(calendar_router)

@api_router.get("/health", tags=["health"])
def health():
    return {"status": "ok"}