from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=True)
    time_horizon = Column(String, nullable=False)
    predicted_rainfall = Column(Float, nullable=True)
    predicted_temp = Column(Float, nullable=True)
    heatwave_risk = Column(String, nullable=True)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SimulationRecord(Base):
    __tablename__ = "simulation_records"

    id = Column(Integer, primary_key=True, index=True)
    temp_offset = Column(Float, nullable=False)
    rainfall_multiplier = Column(Float, nullable=False)
    humidity_offset = Column(Float, nullable=False)
    wind_multiplier = Column(Float, nullable=False)
    flood_risk = Column(String, nullable=False)
    drought_risk = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HistoricalClimateData(Base):
    __tablename__ = "historical_climate_data"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True, nullable=False)
    district = Column(String, index=True, nullable=True)
    year = Column(Integer, index=True, nullable=False)
    month = Column(Integer, nullable=True) # Optional if we do yearly aggregation
    avg_temp = Column(Float, nullable=False)
    total_rainfall = Column(Float, nullable=False)
    extreme_weather_events = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
