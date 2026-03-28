from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import engine, get_db

models.Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/users/", response_model=schemas.User)
def create_item(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_user


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users
