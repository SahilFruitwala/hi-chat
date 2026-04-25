from pydantic_ai import ModelRequest, UserPromptPart, ModelResponse, TextPart
from app.ai import AgentCore
from fastapi import HTTPException
from typing import List, Union, Optional
from sqlalchemy import desc, select
from sqlalchemy.orm import Session
from app import models, schemas
from datetime import datetime, timezone


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


def delete_chat(db: Session, user_id: int, chat_id: int) -> None:
    chat = (
        db.query(models.Chat)
        .filter(models.Chat.user_id == user_id, models.Chat.id == chat_id)
        .first()
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found for this user")

    db.delete(chat)
    db.commit()


def get_chats(
    db: Session, user_id: int, skip: int = 0, limit: int = 10
) -> List[models.Chat]:
    return (
        db.query(models.Chat)
        .filter(models.Chat.user_id == user_id)
        .order_by(desc(models.Chat.updated_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def mock_bot_response(
    message: str,
    model: str,
    model_provider: str,
    message_history: Optional[List[Union[ModelRequest, ModelResponse]]] = None,
) -> str:
    agent = AgentCore.get_agent(model, model_provider)
    if message_history:
        return agent.run_sync(message, message_history=message_history).output
    return agent.run_sync(message).output


def create_chat(db: Session, chat: schemas.ChatCreate, user_id: int) -> models.Chat:
    db_chat = models.Chat(title=chat.message[:15], user_id=user_id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)

    db_message = models.Message(
        message=chat.message, chat_id=db_chat.id, created_by="user", model=chat.model
    )
    db.add(db_message)
    db.commit()

    db_message_bot = models.Message(
        message=mock_bot_response(chat.message, chat.model, chat.model_provider),
        chat_id=db_chat.id,
        created_by="bot",
        model=chat.model,
    )
    db.add(db_message_bot)
    db.commit()
    return db_chat


def create_message(
    db: Session, message: schemas.MessageCreate, chat_id: int
) -> models.Message:
    messages = db.execute(
        select(models.Message.message, models.Message.created_by)
        .where(models.Message.chat_id == chat_id)
        .order_by(models.Message.created_at)
    )

    message_history = []
    for _message, _created_by in messages.all():
        if _created_by == "user":
            message_history.append(
                ModelRequest(parts=[UserPromptPart(content=_message)])
            )
        else:
            message_history.append(ModelResponse(parts=[TextPart(content=_message)]))

    db_message = models.Message(
        message=message.message,
        chat_id=chat_id,
        created_by=message.created_by,
        model=message.model,
    )
    db.add(db_message)
    db.commit()

    db_message_bot = models.Message(
        message=mock_bot_response(
            message.message,
            message.model,
            message.model_provider,
            message_history,
        ),
        chat_id=chat_id,
        created_by="bot",
        model=message.model,
    )
    db.add(db_message_bot)
    db.commit()

    db_chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    db_chat.updated_at = datetime.now(timezone.utc)
    db.commit()

    return db_message_bot
