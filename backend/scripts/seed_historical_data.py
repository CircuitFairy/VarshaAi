import os
import sys
import random
from datetime import datetime
import json

# Add the backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.supabase_client import supabase

# All 28 States and 5 UTs based on frontend locations.ts
states = [
    {"state": "Andhra Pradesh", "districts": ["North Coastal (Visakhapatnam)", "South Coastal (Vijayawada)", "Rayalaseema (Tirupati)"]},
    {"state": "Arunachal Pradesh", "districts": ["Itanagar", "Tawang"]},
    {"state": "Assam", "districts": ["Brahmaputra Valley (Guwahati)", "Barak Valley (Silchar)", "Upper Assam (Dibrugarh)"]},
    {"state": "Bihar", "districts": ["North Bihar (Muzaffarpur)", "Central Bihar (Patna)", "South Bihar (Gaya)"]},
    {"state": "Chhattisgarh", "districts": ["Central (Raipur)", "North (Ambikapur)", "South (Bastar/Jagdalpur)"]},
    {"state": "Goa", "districts": ["North Goa (Panaji)", "South Goa (Margao)"]},
    {"state": "Gujarat", "districts": ["Central (Ahmedabad)", "Saurashtra (Rajkot)", "South (Surat)", "Kutch (Bhuj)"]},
    {"state": "Haryana", "districts": ["North (Ambala)", "Central (Rohtak)", "South (Gurugram)"]},
    {"state": "Himachal Pradesh", "districts": ["Shimla", "Kangra (Dharamshala)", "Kullu-Manali"]},
    {"state": "Jharkhand", "districts": ["Central (Ranchi)", "East (Jamshedpur)", "North (Dhanbad)"]},
    {"state": "Karnataka", "districts": ["South Interior (Bengaluru)", "North Interior (Hubli)", "Coastal (Mangaluru)"]},
    {"state": "Kerala", "districts": ["South (Thiruvananthapuram)", "Central (Kochi)", "North (Kozhikode)"]},
    {"state": "Madhya Pradesh", "districts": ["Central (Bhopal)", "Malwa (Indore)", "Mahakoshal (Jabalpur)", "Gwalior Region"]},
    {"state": "Maharashtra", "districts": ["Konkan (Mumbai)", "Western (Pune)", "Vidarbha (Nagpur)", "Marathwada (Aurangabad)", "North Maharashtra (Nashik)"]},
    {"state": "Manipur", "districts": ["Imphal Valley"]},
    {"state": "Meghalaya", "districts": ["Shillong", "Cherrapunji"]},
    {"state": "Mizoram", "districts": ["Aizawl"]},
    {"state": "Nagaland", "districts": ["Kohima", "Dimapur"]},
    {"state": "Odisha", "districts": ["Coastal (Bhubaneswar)", "North (Balasore)", "South (Berhampur)", "Western (Sambalpur)"]},
    {"state": "Punjab", "districts": ["Majha (Amritsar)", "Doaba (Jalandhar)", "Malwa (Ludhiana)"]},
    {"state": "Rajasthan", "districts": ["East (Jaipur)", "West (Jodhpur)", "South (Udaipur)", "North (Bikaner)"]},
    {"state": "Sikkim", "districts": ["East (Gangtok)"]},
    {"state": "Tamil Nadu", "districts": ["North (Chennai)", "West (Coimbatore)", "Central (Tiruchirappalli)", "South (Madurai)"]},
    {"state": "Telangana", "districts": ["Central (Hyderabad)", "North (Warangal)", "South (Mahbubnagar)"]},
    {"state": "Tripura", "districts": ["Agartala"]},
    {"state": "Uttar Pradesh", "districts": ["Central (Lucknow)", "West (Noida/Meerut)", "East (Varanasi)", "Bundelkhand (Jhansi)"]},
    {"state": "Uttarakhand", "districts": ["Garhwal (Dehradun)", "Kumaon (Nainital)"]},
    {"state": "West Bengal", "districts": ["South (Kolkata)", "North (Siliguri)", "West (Asansol)"]},
    {"state": "Andaman and Nicobar", "districts": ["Port Blair"]},
    {"state": "Chandigarh", "districts": ["Chandigarh"]},
    {"state": "Delhi", "districts": ["New Delhi"]},
    {"state": "Jammu and Kashmir", "districts": ["Jammu Region", "Kashmir Valley (Srinagar)"]},
    {"state": "Ladakh", "districts": ["Leh"]}
]

def seed_historical_data():
    if not supabase:
        print("Supabase client not initialized. Check credentials.")
        return

    print("Starting historical data ingestion (Mock IMD Gridded Data 1973-2023)...")
    
    current_year = 2023
    start_year = 1973
    
    records = []
    
    for state_info in states:
        state = state_info["state"]
        for district in state_info["districts"]:
            
            # Base climate parameters per district (to ensure consistency)
            base_temp = 25.0 + random.uniform(-3, 5)
            base_rain = 800 + random.uniform(-200, 1500)
            
            # Generate 50 years of data
            for year in range(start_year, current_year + 1):
                # Add climate change trend (slight increase in temp over 50 years)
                trend_factor = (year - start_year) / 50.0
                
                # Temperature: increases by ~1.2C over 50 years, with random variance
                avg_temp = base_temp + (trend_factor * 1.2) + random.uniform(-0.8, 0.8)
                
                # Rainfall: More extreme variance in recent years
                rain_variance = random.uniform(-0.2, 0.2)
                if year > 2000 and random.random() > 0.7:
                    # Extreme event year
                    rain_variance = random.uniform(0.3, 0.6) if random.random() > 0.5 else random.uniform(-0.5, -0.3)
                    extreme_events = random.randint(1, 4)
                else:
                    extreme_events = 0
                    
                total_rain = base_rain * (1 + rain_variance)
                
                # Avoid negatives
                total_rain = max(100.0, total_rain)
                
                records.append({
                    "state": state,
                    "district": district,
                    "year": year,
                    "month": None, # Yearly aggregate
                    "avg_temp": round(avg_temp, 2),
                    "total_rainfall": round(total_rain, 1),
                    "extreme_weather_events": extreme_events
                })
                
                # Upload in batches of 100 to avoid request limits
                if len(records) >= 100:
                    response = supabase.table("historical_climate_data").insert(records).execute()
                    print(f"Inserted 100 records for {state} up to {year}...")
                    records = []
                    
    # Insert remaining
    if records:
        response = supabase.table("historical_climate_data").insert(records).execute()
        print(f"Inserted remaining {len(records)} records.")

    print("Historical Data Seeding Complete!")

if __name__ == "__main__":
    seed_historical_data()
