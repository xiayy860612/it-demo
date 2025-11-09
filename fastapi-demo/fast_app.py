
from contextlib import asynccontextmanager
from fastapi import FastAPI

from repository import close_db, init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await on_startup()
    yield
    await on_shutdown()

app = FastAPI(lifespan=lifespan)

async def on_startup():
    await init_db()

async def on_shutdown():
    await close_db()