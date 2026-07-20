from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.db.supabase_client import supabase

router = APIRouter()

@router.get("/historical")
async def get_historical_data(state: str, district: str = None) -> List[Dict[str, Any]]:
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        query = supabase.table("historical_climate_data").select("*").eq("state", state)
        if district:
            query = query.eq("district", district)
            
        # Order by year ascending
        response = query.order("year", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
