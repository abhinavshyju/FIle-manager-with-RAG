from sqlmodel import SQLModel, Field
from datetime import datetime

class ParseContent(SQLModel, table = True):
    id : int = Field(default=None, primary_key=True)
    document_id : int = Field(foreign_key="document.id"),
    content : str = Field(index=True),
    createed_at : datetime = Field(default_factory=datetime.utcnow)