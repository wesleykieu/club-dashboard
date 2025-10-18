from fastapi import APIRouter, HTTPException
from app.services.google_calendar import GoogleCalendarService
from typing import List, Optional
from pydantic import BaseModel
import os

router = APIRouter(prefix="/calendar", tags=["calendar"])

# Define what our response looks like
class CalendarEvent(BaseModel):
    id: str
    title: str
    start: str
    end: str
    description: Optional[str] = ""
    location: Optional[str] = ""

class CalendarResponse(BaseModel):
    events: List[CalendarEvent]
    count: int

@router.get("/upcoming")
async def get_upcoming_events():
    """API endpoint to get 3 upcoming events"""
    try:
        # Get the calendar email from environment variable or config
        calendar_email = os.getenv('GOOGLE_CALENDAR_EMAIL')
        print(f"[env] GOOGLE_CALENDAR_EMAIL at runtime: {bool(calendar_email)}")

        if not calendar_email:
            raise HTTPException(
                status_code=500,
                detail="GOOGLE_CALENDAR_EMAIL environment variable not set"
            )

        # Create the service
        calendar_service = GoogleCalendarService()
        
        # Get events - MUST pass the calendar email
        raw_events = calendar_service.get_upcoming_events(
            max_results=3,
            calendar_email=calendar_email
        )
        
        # Format the events
        formatted_events = [
            CalendarEvent(
                id=event['id'],
                title=event.get('summary', 'No Title'),
                start=event['start'].get('dateTime', event['start'].get('date')),
                end=event['end'].get('dateTime', event['end'].get('date')),
                description=event.get('description', ''),
                location=event.get('location', '')
            )
            for event in raw_events
        ]
        
        # Return response
        return CalendarResponse(
            events=formatted_events,
            count=len(formatted_events)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch calendar events: {str(e)}"
        )