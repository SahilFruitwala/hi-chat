from typing import List
import asyncio
from fastapi import Depends, HTTPException
from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.schemas import User, UserCreate, Chat, ChatCreate, Message, MessageCreate
from app import crud
from app.database import get_db

router = APIRouter()


@router.post("/users/", response_model=User, tags=["users"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)


@router.get("/users/{user_id}", response_model=User, tags=["users"])
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/users/", response_model=list[User], tags=["users"])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.post("/users/{user_id}/chats", response_model=Chat, tags=["users"])
def create_chat(chat: ChatCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_chat(db=db, chat=chat, user_id=user_id)


@router.get("/users/{user_id}/chats/{chat_id}", response_model=Chat, tags=["users"])
def read_chat(chat_id: int, user_id: int, db: Session = Depends(get_db)):
    db_chat = crud.get_chat(db=db, chat_id=chat_id, user_id=user_id)
    if db_chat is None:
        raise HTTPException(status_code=404, detail="Chat not found for this user")
    return db_chat


@router.get("/users/{user_id}/chats", response_model=List[Chat], tags=["users"])
def read_chats(user_id: int, db: Session = Depends(get_db)):
    db_chats = crud.get_chats(db=db, user_id=user_id)
    return db_chats


@router.post("/chats/{chat_id}/messages", response_model=Message, tags=["chats"])
def create_message(message: MessageCreate, chat_id: int, db: Session = Depends(get_db)):
    # await asyncio.sleep(1)
    return crud.create_message(db=db, message=message, chat_id=chat_id)
