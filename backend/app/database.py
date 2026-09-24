import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./network_monitoring.db"

engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db() -> None:
    from app.models import User, Device, NetworkFlow, Threat, Alert, Incident, RiskScore, SystemSetting

    Base.metadata.create_all(bind=engine)
    # create demo users if none exist so admin can login immediately
    try:
        from app.security import hash_password

        db = SessionLocal()
        try:
            if db.query(User).count() == 0:
                db.add(User(username="admin", password_hash=hash_password("admin123"), role="ADMIN"))
                db.add(User(username="analyst", password_hash=hash_password("analyst123"), role="ANALYST"))
                db.add(User(username="viewer", password_hash=hash_password("viewer123"), role="VIEWER"))
                db.commit()
        finally:
            db.close()
    except Exception:
        # best-effort seeding; ignore errors during startup
        pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
