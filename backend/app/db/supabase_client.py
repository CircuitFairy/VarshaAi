import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://lnwjelbgrwsyexievyli.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxud2plbGJncndzeWV4aWV2eWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTkzMTIsImV4cCI6MjA5OTk3NTMxMn0.UtmhC2RRJQmMxeuJ7afhuThnVHSXsXKlEL1JBPc59Pg")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None
