from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.api.external import fetch_live_weather, fetch_air_quality
from app.ml.inference import predict_rainfall

router = APIRouter()

class LiveWeatherResponse(BaseModel):
    state: str
    district: str
    temperature: float
    humidity: float
    wind_speed: float
    rainfall: float
    aqi: int
    health_score: float
    health_status: str
    flood_risk: str
    heatwave_risk: str

@router.get("/live-weather", response_model=LiveWeatherResponse)
async def get_live_weather(state: str, district: str, lat: float, lon: float):
    
    try:
        weather_data = await fetch_live_weather(lat, lon)
        aqi_data = await fetch_air_quality(lat, lon)
        
        current = weather_data.get("current", {})
        temp = current.get("temperature_2m", 30.0)
        humidity = current.get("relative_humidity_2m", 60.0)
        wind = current.get("wind_speed_10m", 10.0)
        live_rain = current.get("precipitation", 0.0)
        
        aqi = aqi_data.get("current", {}).get("us_aqi", 50) if aqi_data else 50
        
        # ML Prediction using Live Data
        try:
            predicted_rain = predict_rainfall(state, temp, humidity, wind)
        except Exception:
            predicted_rain = live_rain
            
        # Climate Health Score Algorithm (0-100)
        # 100 = Perfect conditions, 0 = Catastrophic
        score = 100
        
        # Penalties for extremes
        if temp > 35:
            score -= (temp - 35) * 5
        elif temp < 10:
            score -= (10 - temp) * 3
            
        if aqi > 100:
            score -= (aqi - 100) * 0.2
            
        if predicted_rain > 100:
            score -= (predicted_rain - 100) * 0.5
            
        score = max(0, min(100, score))
        
        # Define Status
        if score > 80:
            status = "Green"
        elif score > 60:
            status = "Yellow"
        elif score > 40:
            status = "Orange"
        else:
            status = "Red"
            
        flood_risk = "High" if predicted_rain > 150 else "Moderate" if predicted_rain > 50 else "Low"
        heatwave_risk = "Critical" if temp > 40 else "High" if temp > 35 else "Low"
        
        return LiveWeatherResponse(
            state=state,
            district=district,
            temperature=temp,
            humidity=humidity,
            wind_speed=wind,
            rainfall=live_rain,
            aqi=int(aqi),
            health_score=round(score, 1),
            health_status=status,
            flood_risk=flood_risk,
            heatwave_risk=heatwave_risk
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
