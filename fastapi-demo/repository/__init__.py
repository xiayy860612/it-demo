from tortoise import Tortoise

DB_URL = "sqlite://test.db"

async def init_db():
    await Tortoise.init(
        db_url=DB_URL,
        modules={'models': ['models.task']}
    )
    await Tortoise.generate_schemas()

async def close_db():
    await Tortoise.close_connections()
