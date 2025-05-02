from sqlmodel import SQLModel ,Field
from datetime import datetime


class Document(SQLModel ,table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    filename  : str = Field(index=True),
    size : int
    type : str
    active : bool = False
    createed_at : datetime = Field(default_factory=datetime.utcnow)
