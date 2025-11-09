
from dataclasses import dataclass
from datetime import datetime
from enum import IntEnum

from sqlalchemy import JSON, Column, DateTime, Integer, String, Enum as SAEnum

from model import BaseEntity


class EventStatus(IntEnum):
    PENDING = 1

class TaskEvent(BaseEntity):
    __tablename__ = "task_event"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False, index=True)
    params = Column(JSON, nullable=False, default=dict)
    status = Column(SAEnum(EventStatus), nullable=False)

    created_time = Column(DateTime, default=datetime.now())
    created_by = Column(String, nullable=False, default="sys")
    updated_time = Column(DateTime, default=datetime.now(), onupdate=datetime.now())
    updated_by = Column(String, nullable=False, default="sys")
