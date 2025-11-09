from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from model import BaseEntity

DB_URL = "sqlite:///./test.db"

engine = create_engine(
    DB_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    BaseEntity.metadata.create_all(bind=engine)

def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
