import httpx
from aiocache import cached, Cache

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
# Simplified URL, in production we would match coordinates to the requested state
# For demo purposes, we will take lat/lon as input and return weather data.

@cached(ttl=1800, cache=Cache.MEMORY)
async def fetch_live_weather(lat: float, lon: float):
    """
    Fetches current weather and forecast from Open-Meteo.
    Cached for 30 minutes (1800 seconds) to avoid rate limits.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloud_cover", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
        "timezone": "auto"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(OPEN_METEO_URL, params=params)
        response.raise_for_status()
        return response.json()

@cached(ttl=3600, cache=Cache.MEMORY)
async def fetch_air_quality(lat: float, lon: float):
    """
    Fetches air quality from Open-Meteo Air Quality API (easier than OpenAQ for lat/lon without complex location mapping).
    Cached for 1 hour.
    """
    url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "us_aqi"],
        "timezone": "auto"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None # Fail gracefully if API is down
