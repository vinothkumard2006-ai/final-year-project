from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router, start_event_generator
from app.database import init_db

app = FastAPI(title="Intelligent Network Monitoring Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("startup")
def startup_event() -> None:
    init_db()
    # start background event generator for live demo updates
    try:
        start_event_generator(app)
    except Exception:
        pass

@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
