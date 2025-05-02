from typing import Optional
from pydantic import BaseModel 

class AgentChat(BaseModel):
    msg: str
    document_id : Optional[int]
