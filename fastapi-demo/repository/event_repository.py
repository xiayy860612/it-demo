

from fastapi import Depends
from sqlalchemy.orm import Session

from model.event import TaskEvent
from repository import SessionLocal


def create(event: TaskEvent):
    session = SessionLocal()
    try:
        session.add(event)
        session.commit()
        session.refresh(event)
        return event
    finally:
        session.close()
    