from datetime import datetime
from typing import List

from sqlalchemy import ForeignKey, String, Text, func
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))

    chats: Mapped[List["Chat"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Chat(Base):
    __tablename__ = "chat"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100))

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="chats")

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    messages: Mapped[List["Message"]] = relationship(
        back_populates="chat",
        cascade="all, delete-orphan",
        foreign_keys="[Message.chat_id]",
        order_by="Message.created_at",  # Add this line
    )

    # first_message_id: Mapped[Optional[int]] = mapped_column(ForeignKey("message.id", use_alter=True), nullable=True)
    # last_message_id: Mapped[Optional[int]] = mapped_column(ForeignKey("message.id", use_alter=True), nullable=True)

    # first_message: Mapped[Optional["Message"]] = relationship(foreign_keys=[first_message_id])
    # last_message: Mapped[Optional["Message"]] = relationship(foreign_keys=[last_message_id])


class Message(Base):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    message: Mapped[str] = mapped_column(Text())

    chat_id: Mapped[int] = mapped_column(ForeignKey("chat.id"))
    chat: Mapped["Chat"] = relationship(back_populates="messages")

    created_by: Mapped[str] = mapped_column(String(10))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    model: Mapped[str] = mapped_column(String(100), nullable=True)
