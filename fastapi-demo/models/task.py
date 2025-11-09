
from dataclasses import dataclass
from datetime import datetime
from enum import IntEnum, unique


from models import BaseEntity
from tortoise import fields


@unique
class EventStatus(IntEnum):
    PENDING = 1

class TaskEvent(BaseEntity):
    id = fields.IntField(pk=True)
    event_type = fields.CharField(max_length=255, null=False, index=True)
    params = fields.JSONField(null=False, default=dict)
    status = fields.IntEnumField(EventStatus, null=False)

    class Meta:
        table = "task_event"

    def __str__(self):
        return f"<TaskEvent {self.id}: {self.event_type} - {self.status}>"
