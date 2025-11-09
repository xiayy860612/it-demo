
from tortoise import Model, fields


BaseEntity = Model

class BaseEntity(Model):
    created_time = fields.DatetimeField(auto_now_add=True)
    created_by = fields.CharField(max_length=255, null=False, default="sys")
    updated_time = fields.DatetimeField(auto_now=True)
    updated_by = fields.CharField(max_length=255, null=False, default="sys")
