from fastapi import APIRouter 
from fastapi.params import Depends
from models.user import User
from schemas import AgentChat
from utils import agent_chat as chat
from fastapi.responses import JSONResponse

from utils.dependencies import get_current_user

router = APIRouter()



@router.post("/")
async def agent_chat(msg : AgentChat , user: User = Depends(get_current_user),):
    result = chat(msg.msg , user_id=user.id)
    return JSONResponse(status_code=200,content={"answer": result})

@router.post("/doc")
async def agent_chat(msg : AgentChat , user: User = Depends(get_current_user),):
    result = chat(msg.msg , user_id=user.id , document_id=msg.document_id)
    return JSONResponse(status_code=200,content={"answer": result})