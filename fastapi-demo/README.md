# FastAPI Demo

## Features

```puml
actor C as "Client"
cloud B as "Broker Service"
cloud D as "Dispatch Service"
cloud W as "Worker Service"
queue MQ as "Message Queue"
database DB


W --> B: register worker node

C --> B: create task
B --> DB: save new task
B ..> D: trigger task dispatch

D --> DB: get new tasks and assign to workers
D ..> MQ: dispatch task

W ..> MQ: get dispatched tasks
W --> DB: process tasks

```

## Tech Stack

- FastAPI, backend framework
- Swagger, API Document
- pydantic, request validation
- typing, type declaration
- APIRouter，route

## Setup

use `uv` to setup environment

```sh
uv sync

fastapi dev main.py
```

