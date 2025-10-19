from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import api_router
from dotenv import load_dotenv
from pathlib import Path
import os

# Set environment variables directly
os.environ['GOOGLE_CALENDAR_EMAIL'] = 'wesleykieu.business@gmail.com'
os.environ['GOOGLE_SERVICE_ACCOUNT_FILE'] = './credentials.json'
calender_email = os.getenv('GOOGLE_CALENDAR_EMAIL')

app = FastAPI(title="AKPsi Credit Tracker API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")