from datetime import datetime
from typing import List, Literal, Optional
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
    model: str


class ChatCore(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    title: str

    model_config = ConfigDict(from_attributes=True)


class Chat(ChatCore):
    messages: List["Message"]


class MessageBase(BaseModel):
    message: str
    created_by: Literal["user", "bot"]
    model: Optional[str] = None


class MessageCreate(MessageBase):
    pass


class Message(MessageBase):
    id: int
    chat_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
