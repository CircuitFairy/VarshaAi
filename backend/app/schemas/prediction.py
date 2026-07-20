from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class PredictionRequest(BaseModel):
    state: str
    district: str
    lat: float
    lon: float
    time_horizon: str

class PredictionResponse(BaseModel):
    id: int
    state: str
    district: str
    time_horizon: str
    predicted_rainfall: Optional[float] = None
    predicted_temp: Optional[float] = None
    heatwave_risk: Optional[str] = None
    confidence: float
    feature_importance: Optional[Dict[str, float]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SimulationRequest(BaseModel):
    temp_offset: float
    rainfall_multiplier: float
    humidity_offset: float
    wind_multiplier: float

class SimulationResponse(BaseModel):
    id: int
    flood_risk: str
    drought_risk: str
    created_at: datetime

    class Config:
        from_attributes = True
