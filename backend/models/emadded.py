from sqlmodel import SQLModel, Field
from typing import Optional
from sqlalchemy import Column
from pgvector.sqlalchemy import Vector

class TextEmbedding(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    document_id: int = Field(foreign_key="document.id")
    content: str
    embedding: Optional[list[float]] = Field(sa_column=Column(Vector(384)))  

