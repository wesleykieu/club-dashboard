from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime
import os

class GoogleCalendarService:
    """Service for interacting with Google Calendar API"""
   
    SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
   
    def __init__(self):
        self.service_account_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
        if not self.service_account_file:
            raise Exception("GOOGLE_SERVICE_ACCOUNT_FILE environment variable not set")
        self.service = self._get_calendar_service()
   
    def _get_calendar_service(self):
        """Initialize and return the Google Calendar service"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                self.service_account_file, 
                scopes=self.SCOPES
            )
            
            
            service = build('calendar', 'v3', credentials=credentials)
            return service
        except Exception as e:
            raise Exception(f"Failed to initialize Google Calendar service: {str(e)}")
   
    def get_upcoming_events(self, max_results=3, calendar_email=None):
        """Fetch upcoming events from Google Calendar
        
        Args:
            max_results: Maximum number of events to return
            calendar_email: Calendar ID (email) to fetch events from
        """
        try:
            # Use provided email or fall back to env variable
            if not calendar_email:
                calendar_email = os.getenv('GOOGLE_CALENDAR_EMAIL')
            
            if not calendar_email:
                raise Exception("Calendar email not provided and GOOGLE_CALENDAR_EMAIL not set")
            
            now = datetime.utcnow().isoformat() + 'Z'
            
            events_result = self.service.events().list(
                calendarId=calendar_email,
                timeMin=now,
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
           
            events = events_result.get('items', [])
            print(f"📅 Found {len(events)} upcoming events")
           
            return events
       
        except Exception as e:
            print(f"❌ Error fetching events: {str(e)}")
            raise Exception(f"Failed to fetch events: {str(e)}")