from datetime import datetime
from typing import Any
from fastapi import APIRouter
from pydantic import Field

from api import BaseDTO
from model.event import EventStatus, TaskEvent
from repository import event_repository

event_router = APIRouter(prefix="/tasks", tags=["tasks"])

class CreateEventRequest(BaseDTO):
    event_type: str = Field(..., description="event_type is required")
    params: dict[str, Any] = Field(default_factory=dict)

class CreateEventResponse(BaseDTO):
    id: int

    class Config:
        from_attributes = True


@event_router.post("/", response_model=CreateEventResponse)
def create_task_event(request: CreateEventRequest):
    event = TaskEvent(
        event_type=request.event_type,
        params=request.params,
        status=EventStatus.PENDING,
        created_time=datetime.now(),
    )
    event = event_repository.create(event)
    return event