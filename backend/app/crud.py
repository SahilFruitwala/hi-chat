from typing import List
from sqlalchemy import desc
from sqlalchemy.orm import Session
from app import models, schemas


def get_user(db: Session, user_id: int) -> models.User:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_chat(db: Session, user_id: int, chat_id: int) -> models.Chat:
    return (
        db.query(models.Chat)
        .filter(models.Chat.user_id == user_id, models.Chat.id == chat_id)
        .first()
    )


def get_chats(
    db: Session, user_id: int, skip: int = 0, limit: int = 10
) -> List[models.Chat]:
    return (
        db.query(models.Chat)
        .filter(models.Chat.user_id == user_id)
        .order_by(desc(models.Chat.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def mock_bot_response(message: str) -> str:
    return f"Echo: {message}"


def create_chat(db: Session, chat: schemas.ChatCreate, user_id: int) -> models.Chat:
    db_chat = models.Chat(title=chat.message[:15], user_id=user_id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    db_message = models.Message(
        message=chat.message, chat_id=db_chat.id, created_by="user"
    )
    db.add(db_message)
    db.commit()

    db_message_bot = models.Message(
        message=mock_bot_response(chat.message),
        chat_id=db_chat.id,
        created_by="bot",
    )
    db.add(db_message_bot)
    db.commit()
    return db_chat


def create_message(
    db: Session, message: schemas.MessageCreate, chat_id: int
) -> models.Message:
    db_message = models.Message(
        message=message.message,
        chat_id=chat_id,
        created_by=message.created_by,
    )
    db.add(db_message)
    db.commit()

    db_message_bot = models.Message(
        message=mock_bot_response(message.message),
        chat_id=chat_id,
        created_by="bot",
    )
    db.add(db_message_bot)
    db.commit()

    return db_message_bot
