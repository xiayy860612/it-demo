import logging
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from error import BusinessException, ErrorCode, ErrorResponse
from fast_app import app

logger = logging.getLogger(__name__)

@app.exception_handler(BusinessException)
async def validation_exception_handler(request: Request, exc: BusinessException):
    return __generate_error_response(500, exc.code, exc.message)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return __generate_error_response(400, ErrorCode.INVALID_PARAMS, str(exc))

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.exception(f"Unhandled exception at {request.url}: {exc}")
    return __generate_error_response(500, ErrorCode.UNKNOWN, "Inner Error")

def __generate_error_response(status_code: int, error_code: ErrorCode, msg: str):
    error = ErrorResponse(code=error_code, message=msg)
    return JSONResponse(
        status_code=status_code,
        content=error.model_dump(),
    )