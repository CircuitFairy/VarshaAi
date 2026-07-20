import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VarshaAI"
    # Use SQLite for local development by default, unless overridden
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./varsha.db")

settings = Settings()
