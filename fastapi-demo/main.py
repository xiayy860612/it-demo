
from fastapi import FastAPI

from api.task import task_router
from repository import init_db

from fast_app import app

from error import global_exception_handler

# register routers
app.include_router(task_router)
