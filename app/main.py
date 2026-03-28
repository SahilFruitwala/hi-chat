from fastapi import FastAPI
from app import models
from app.database import engine
from app.routes import router

app = FastAPI()


app.include_router(router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
