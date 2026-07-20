from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Since we use SQLite for local development, we need to adapt the URL for async driver
# For postgres it would be postgresql+asyncpg://
if settings.DATABASE_URL.startswith("sqlite"):
    # Convert sqlite:///./varsha.db to sqlite+aiosqlite:///./varsha.db
    ASYNC_DATABASE_URL = settings.DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://")
    engine = create_async_engine(ASYNC_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Assuming PostgreSQL for production (Railway)
    ASYNC_DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql+asyncpg://").replace("postgresql://", "postgresql+asyncpg://")
    engine = create_async_engine(ASYNC_DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
