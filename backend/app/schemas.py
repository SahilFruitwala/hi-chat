from datetime import datetime
from typing import List, Literal
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    name: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ChatCreate(BaseModel):
    message: str


class Chat(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    messages: List["Message"]

    model_config = ConfigDict(from_attributes=True)


class MessageBase(BaseModel):
    message: str
    created_by: Literal["user", "bot"]


class MessageCreate(MessageBase):
    model: str


class Message(MessageBase):
    id: int
    chat_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
