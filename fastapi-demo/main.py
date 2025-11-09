
from fastapi import FastAPI

from api.event import event_router
from repository import init_db

init_db()

app = FastAPI()

# register routers
app.include_router(event_router)
