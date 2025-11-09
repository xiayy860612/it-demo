from datetime import datetime
from typing import Any
from fastapi import APIRouter
from pydantic import BaseModel, Field

from models.task import EventStatus, TaskEvent
from repository import event_repository

task_router = APIRouter(prefix="/tasks", tags=["tasks"])

class CreateTaskRequest(BaseModel):
    event_type: str = Field(..., description="event_type is required")
    params: dict[str, Any] = Field(default_factory=dict)

class CreateTaskResponse(BaseModel):
    id: int

    class Config:
        from_attributes = True


@task_router.post("/", response_model=CreateTaskResponse)
async def create_task_event(request: CreateTaskRequest):
    event = await TaskEvent.create(
        event_type=request.event_type,
        params=request.params,
        status=EventStatus.PENDING,
        created_time=datetime.now(),
    )
    return event