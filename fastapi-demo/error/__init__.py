
from enum import IntEnum, unique

from pydantic import BaseModel

@unique
class ErrorCode(IntEnum):
    UNKNOWN = 1
    INVALID_PARAMS = 2


class ErrorResponse(BaseModel):
    code: ErrorCode
    message: str


class BusinessException(Exception):

    def __init__(self, code: ErrorCode, message: str):
        self.code = code
        self.message = message
