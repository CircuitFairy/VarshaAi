import httpx
import asyncio
from fastapi import APIRouter
from datetime import datetime, timezone
from typing import List, Dict, Any

router = APIRouter()

# ============================================================
# WMO Weather Interpretation Codes → Alert Classification
# ============================================================
WMO_CODES: Dict[int, Dict[str, Any]] = {
    0: {"label": "Clear sky", "severity": 0, "category": "clear"},
    1: {"label": "Mainly clear", "severity": 0, "category": "clear"},
    2: {"label": "Partly cloudy", "severity": 0, "category": "clear"},
    3: {"label": "Overcast", "severity": 1, "category": "cloud"},
    45: {"label": "Fog", "severity": 1, "category": "fog"},
    48: {"label": "Depositing rime fog", "severity": 2, "category": "fog"},
    51: {"label": "Light drizzle", "severity": 1, "category": "rain"},
    53: {"label": "Moderate drizzle", "severity": 1, "category": "rain"},
    55: {"label": "Dense drizzle", "severity": 2, "category": "rain"},
    56: {"label": "Freezing light drizzle", "severity": 2, "category": "rain"},
    57: {"label": "Freezing dense drizzle", "severity": 3, "category": "rain"},
    61: {"label": "Slight rain", "severity": 1, "category": "rain"},
    63: {"label": "Moderate rain", "severity": 2, "category": "rain"},
    65: {"label": "Heavy rain", "severity": 3, "category": "rain"},
    66: {"label": "Freezing light rain", "severity": 3, "category": "rain"},
    67: {"label": "Freezing heavy rain", "severity": 4, "category": "rain"},
    71: {"label": "Slight snowfall", "severity": 2, "category": "snow"},
    73: {"label": "Moderate snowfall", "severity": 3, "category": "snow"},
    75: {"label": "Heavy snowfall", "severity": 4, "category": "snow"},
    77: {"label": "Snow grains", "severity": 2, "category": "snow"},
    80: {"label": "Slight rain showers", "severity": 1, "category": "rain"},
    81: {"label": "Moderate rain showers", "severity": 2, "category": "rain"},
    82: {"label": "Violent rain showers", "severity": 4, "category": "rain"},
    85: {"label": "Slight snow showers", "severity": 2, "category": "snow"},
    86: {"label": "Heavy snow showers", "severity": 4, "category": "snow"},
    95: {"label": "Thunderstorm", "severity": 3, "category": "thunderstorm"},
    96: {"label": "Thunderstorm with slight hail", "severity": 4, "category": "thunderstorm"},
    99: {"label": "Thunderstorm with heavy hail", "severity": 5, "category": "thunderstorm"},
}

# ============================================================
# Critical monitoring locations across India
# ============================================================
MONITOR_LOCATIONS = [
    {"name": "Mumbai", "state": "Maharashtra", "lat": 19.076, "lon": 72.877, "zone": "Konkan Coast"},
    {"name": "Delhi", "state": "Delhi", "lat": 28.613, "lon": 77.209, "zone": "Indo-Gangetic Plains"},
    {"name": "Kolkata", "state": "West Bengal", "lat": 22.572, "lon": 88.363, "zone": "Bay of Bengal Delta"},
    {"name": "Chennai", "state": "Tamil Nadu", "lat": 13.082, "lon": 80.270, "zone": "Coromandel Coast"},
    {"name": "Guwahati", "state": "Assam", "lat": 26.144, "lon": 91.736, "zone": "Brahmaputra Valley"},
    {"name": "Bhubaneswar", "state": "Odisha", "lat": 20.296, "lon": 85.824, "zone": "East Coastal"},
    {"name": "Jaipur", "state": "Rajasthan", "lat": 26.912, "lon": 75.787, "zone": "Thar Desert Fringe"},
    {"name": "Bengaluru", "state": "Karnataka", "lat": 12.971, "lon": 77.594, "zone": "Deccan Plateau"},
    {"name": "Lucknow", "state": "Uttar Pradesh", "lat": 26.846, "lon": 80.946, "zone": "Central Plains"},
    {"name": "Kochi", "state": "Kerala", "lat": 9.931, "lon": 76.267, "zone": "Malabar Coast"},
    {"name": "Dehradun", "state": "Uttarakhand", "lat": 30.316, "lon": 78.032, "zone": "Sub-Himalayan"},
    {"name": "Shimla", "state": "Himachal Pradesh", "lat": 31.104, "lon": 77.173, "zone": "Western Himalaya"},
    {"name": "Port Blair", "state": "Andaman and Nicobar", "lat": 11.623, "lon": 92.726, "zone": "Bay Islands"},
    {"name": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.686, "lon": 83.218, "zone": "AP Coastal"},
    {"name": "Ahmedabad", "state": "Gujarat", "lat": 23.022, "lon": 72.571, "zone": "Gujarat Plains"},
    {"name": "Patna", "state": "Bihar", "lat": 25.594, "lon": 85.137, "zone": "North Bihar Flood Plains"},
    {"name": "Srinagar", "state": "Jammu and Kashmir", "lat": 34.083, "lon": 74.797, "zone": "Kashmir Valley"},
    {"name": "Mangaluru", "state": "Karnataka", "lat": 12.914, "lon": 74.856, "zone": "Karnataka Coast"},
    {"name": "Silchar", "state": "Assam", "lat": 24.833, "lon": 92.778, "zone": "Barak Valley"},
    {"name": "Cherrapunji", "state": "Meghalaya", "lat": 25.270, "lon": 91.732, "zone": "Meghalaya Plateau"},
]

OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_AQI_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

# Simple in-memory cache
_alerts_cache: Dict[str, Any] = {"data": None, "timestamp": None}
CACHE_TTL_SECONDS = 600  # 10 minutes


def _classify_alerts(weather_data: dict, aqi_data: dict | None, location: dict) -> list[dict]:
    """
    Classify live weather into actionable alerts based on WMO code,
    temperature extremes, wind gusts, rainfall intensity, and AQI.
    """
    current = weather_data.get("current", {})
    temp = current.get("temperature_2m", 25)
    humidity = current.get("relative_humidity_2m", 50)
    wind_speed = current.get("wind_speed_10m", 0)
    wind_gusts = current.get("wind_gusts_10m", 0)
    rain = current.get("rain", 0)
    precipitation = current.get("precipitation", 0)
    weather_code = current.get("weather_code", 0)
    cloud_cover = current.get("cloud_cover", 0)

    wmo_info = WMO_CODES.get(weather_code, {"label": "Unknown", "severity": 0, "category": "clear"})

    aqi_value = 0
    if aqi_data:
        aqi_current = aqi_data.get("current", {})
        aqi_value = aqi_current.get("us_aqi", 0) or 0

    alerts: list[dict] = []

    # ──── HEATWAVE ALERT ────
    if temp >= 40:
        severity = 5 if temp >= 45 else (4 if temp >= 42 else 3)
        alerts.append({
            "type": "heatwave",
            "category": "EXTREME HEAT",
            "severity": severity,
            "title": f"Severe Heatwave Warning — {location['name']}",
            "description": (
                f"Surface temperature at {temp:.1f}°C in {location['zone']}, {location['state']}. "
                f"Humidity at {humidity}%. Heat index dangerously elevated. "
                f"Outdoor exposure restrictions recommended for vulnerable populations."
            ),
            "metric_label": "TEMPERATURE",
            "metric_value": f"{temp:.1f}°C",
            "secondary_label": "HUMIDITY",
            "secondary_value": f"{humidity}%",
            "color": "#ff6b6b",
        })

    # ──── HEAVY RAINFALL / FLOOD RISK ────
    if precipitation >= 15 or rain >= 10 or (wmo_info["severity"] >= 3 and wmo_info["category"] == "rain"):
        severity = 5 if precipitation >= 60 else (4 if precipitation >= 30 else 3)
        alerts.append({
            "type": "rain",
            "category": "HEAVY RAINFALL",
            "severity": severity,
            "title": f"Heavy Rainfall Alert — {location['name']}",
            "description": (
                f"{wmo_info['label']} conditions in {location['zone']}, {location['state']}. "
                f"Current precipitation rate: {precipitation:.1f} mm/hr. "
                f"Flood risk elevated for low-lying and river basin areas. "
                f"Wind speed {wind_speed:.0f} km/h."
            ),
            "metric_label": "PRECIPITATION",
            "metric_value": f"{precipitation:.1f} mm/hr",
            "secondary_label": "WIND SPEED",
            "secondary_value": f"{wind_speed:.0f} km/h",
            "color": "#3cd7ff",
        })

    # ──── CYCLONE / HIGH WIND ALERT ────
    if wind_gusts >= 60 or wind_speed >= 50:
        severity = 5 if wind_gusts >= 120 else (4 if wind_gusts >= 80 else 3)
        alerts.append({
            "type": "cyclone",
            "category": "CYCLONIC ACTIVITY",
            "severity": severity,
            "title": f"Severe Wind / Cyclone Warning — {location['name']}",
            "description": (
                f"Extreme wind gusts recorded at {wind_gusts:.0f} km/h in {location['zone']}, {location['state']}. "
                f"Sustained wind speed: {wind_speed:.0f} km/h. "
                f"Structural damage risk HIGH. Coastal storm surge possible."
            ),
            "metric_label": "WIND GUSTS",
            "metric_value": f"{wind_gusts:.0f} km/h",
            "secondary_label": "SUSTAINED",
            "secondary_value": f"{wind_speed:.0f} km/h",
            "color": "#fb923c",
        })

    # ──── THUNDERSTORM ALERT ────
    if wmo_info["category"] == "thunderstorm":
        severity = wmo_info["severity"]
        alerts.append({
            "type": "thunderstorm",
            "category": "THUNDERSTORM",
            "severity": severity,
            "title": f"Thunderstorm Alert — {location['name']}",
            "description": (
                f"{wmo_info['label']} activity detected in {location['zone']}, {location['state']}. "
                f"Lightning risk elevated. Temperature at {temp:.1f}°C with {cloud_cover}% cloud cover. "
                f"Wind gusts reaching {wind_gusts:.0f} km/h."
            ),
            "metric_label": "CLOUD COVER",
            "metric_value": f"{cloud_cover}%",
            "secondary_label": "WIND GUSTS",
            "secondary_value": f"{wind_gusts:.0f} km/h",
            "color": "#c084fc",
        })

    # ──── AQI ALERT ────
    if aqi_value >= 150:
        severity = 5 if aqi_value >= 300 else (4 if aqi_value >= 200 else 3)
        aqi_label = "Hazardous" if aqi_value >= 300 else ("Very Unhealthy" if aqi_value >= 200 else "Unhealthy")
        alerts.append({
            "type": "aqi",
            "category": "AIR QUALITY",
            "severity": severity,
            "title": f"Air Quality Alert ({aqi_label}) — {location['name']}",
            "description": (
                f"US AQI index at {aqi_value} in {location['zone']}, {location['state']}. "
                f"Classification: {aqi_label}. Particulate matter concentration elevated. "
                f"Outdoor activity restrictions advised for sensitive groups."
            ),
            "metric_label": "US AQI",
            "metric_value": str(aqi_value),
            "secondary_label": "STATUS",
            "secondary_value": aqi_label.upper(),
            "color": "#ffb4ab",
        })

    # ──── FOG / VISIBILITY ALERT ────
    if wmo_info["category"] == "fog":
        alerts.append({
            "type": "fog",
            "category": "LOW VISIBILITY",
            "severity": 2,
            "title": f"Dense Fog Advisory — {location['name']}",
            "description": (
                f"{wmo_info['label']} reported in {location['zone']}, {location['state']}. "
                f"Visibility significantly reduced. Temperature at {temp:.1f}°C. "
                f"Travel advisories in effect for highways and aviation."
            ),
            "metric_label": "VISIBILITY",
            "metric_value": "Low",
            "secondary_label": "TEMPERATURE",
            "secondary_value": f"{temp:.1f}°C",
            "color": "#94a3b8",
        })

    # ──── SNOWFALL ALERT ────
    if wmo_info["category"] == "snow" and wmo_info["severity"] >= 2:
        alerts.append({
            "type": "snow",
            "category": "HEAVY SNOWFALL",
            "severity": wmo_info["severity"],
            "title": f"Snowfall Warning — {location['name']}",
            "description": (
                f"{wmo_info['label']} in {location['zone']}, {location['state']}. "
                f"Temperature at {temp:.1f}°C. Road closures and avalanche risk possible "
                f"in mountainous terrain."
            ),
            "metric_label": "TEMPERATURE",
            "metric_value": f"{temp:.1f}°C",
            "secondary_label": "WIND",
            "secondary_value": f"{wind_speed:.0f} km/h",
            "color": "#e2e8f0",
        })

    # ──── Moderate rain (lower threshold for monsoon context) ────
    if not alerts and (precipitation >= 5 or rain >= 3 or (wmo_info["severity"] >= 2 and wmo_info["category"] == "rain")):
        alerts.append({
            "type": "rain",
            "category": "MODERATE RAINFALL",
            "severity": 2,
            "title": f"Rainfall Watch — {location['name']}",
            "description": (
                f"{wmo_info['label']} conditions in {location['zone']}, {location['state']}. "
                f"Precipitation rate: {precipitation:.1f} mm/hr. Temperature: {temp:.1f}°C. "
                f"Monitor water levels in vulnerable catchment areas."
            ),
            "metric_label": "PRECIPITATION",
            "metric_value": f"{precipitation:.1f} mm/hr",
            "secondary_label": "TEMPERATURE",
            "secondary_value": f"{temp:.1f}°C",
            "color": "#3cd7ff",
        })

    # ──── Moderate heat (35–39°C) ────
    if not alerts and temp >= 35:
        alerts.append({
            "type": "heatwave",
            "category": "HEAT ADVISORY",
            "severity": 2,
            "title": f"Heat Advisory — {location['name']}",
            "description": (
                f"Temperature at {temp:.1f}°C in {location['zone']}, {location['state']}. "
                f"Heat stress risk moderate. Humidity at {humidity}%. "
                f"Hydration advisories recommended."
            ),
            "metric_label": "TEMPERATURE",
            "metric_value": f"{temp:.1f}°C",
            "secondary_label": "HUMIDITY",
            "secondary_value": f"{humidity}%",
            "color": "#fbbf24",
        })

    # ──── Moderate AQI (100–149) ────
    if not alerts and aqi_value >= 100:
        alerts.append({
            "type": "aqi",
            "category": "AIR QUALITY",
            "severity": 2,
            "title": f"Moderate AQI Watch — {location['name']}",
            "description": (
                f"US AQI index at {aqi_value} in {location['zone']}, {location['state']}. "
                f"Air quality unhealthy for sensitive groups. Outdoor exercise caution advised."
            ),
            "metric_label": "US AQI",
            "metric_value": str(aqi_value),
            "secondary_label": "STATUS",
            "secondary_value": "MODERATE",
            "color": "#fbbf24",
        })

    return alerts


async def _fetch_single_location(client: httpx.AsyncClient, loc: dict) -> tuple[dict, dict | None]:
    """Fetch weather + AQI for a single location using a shared client."""
    weather_params = {
        "latitude": loc["lat"],
        "longitude": loc["lon"],
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
        "timezone": "auto",
    }
    aqi_params = {
        "latitude": loc["lat"],
        "longitude": loc["lon"],
        "current": "pm10,pm2_5,us_aqi",
        "timezone": "auto",
    }

    weather_resp = await client.get(OPEN_METEO_FORECAST_URL, params=weather_params)
    weather_resp.raise_for_status()
    weather = weather_resp.json()

    aqi = None
    try:
        aqi_resp = await client.get(OPEN_METEO_AQI_URL, params=aqi_params)
        aqi_resp.raise_for_status()
        aqi = aqi_resp.json()
    except Exception:
        pass  # AQI is optional

    return weather, aqi


@router.get("/alerts")
async def get_live_alerts():
    """
    Fetches real-time weather from Open-Meteo for 20 Indian hotspot cities,
    classifies conditions into actionable alerts using WMO codes and thresholds,
    and returns a prioritized alert feed sorted by severity.

    Data Source: Open-Meteo (free, no API key, WMO-backed forecast models)
    Refresh: cached for 10 minutes to respect rate limits.
    """
    global _alerts_cache

    # Check cache validity
    now = datetime.now(timezone.utc)
    if (
        _alerts_cache["data"] is not None
        and _alerts_cache["timestamp"] is not None
        and (now - _alerts_cache["timestamp"]).total_seconds() < CACHE_TTL_SECONDS
    ):
        return _alerts_cache["data"]

    all_alerts: List[dict] = []
    now_iso = now.isoformat()

    async with httpx.AsyncClient(timeout=15) as client:
        # Fetch all locations in parallel
        tasks = [_fetch_single_location(client, loc) for loc in MONITOR_LOCATIONS]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for loc, result in zip(MONITOR_LOCATIONS, results):
            if isinstance(result, Exception):
                print(f"[ALERT ENGINE] Failed to fetch for {loc['name']}: {result}")
                continue

            weather, aqi = result
            loc_alerts = _classify_alerts(weather, aqi, loc)
            for alert in loc_alerts:
                alert["location"] = {
                    "name": loc["name"],
                    "state": loc["state"],
                    "zone": loc["zone"],
                    "lat": loc["lat"],
                    "lon": loc["lon"],
                }
                alert["timestamp"] = now_iso
                alert["source"] = "Open-Meteo (WMO Forecast Models)"
                all_alerts.append(alert)

    # Sort by severity descending
    all_alerts.sort(key=lambda a: a.get("severity", 0), reverse=True)

    response = {
        "timestamp": now_iso,
        "total_alerts": len(all_alerts),
        "monitoring_stations": len(MONITOR_LOCATIONS),
        "data_source": "Open-Meteo (WMO Forecast Models) | Open-Meteo Air Quality API",
        "alerts": all_alerts,
    }

    # Cache the response
    _alerts_cache = {"data": response, "timestamp": now}

    return response
