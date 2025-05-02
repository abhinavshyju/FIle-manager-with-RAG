from fastapi import APIRouter
from routes import auth ,upload , agent , file
from utils import get_current_user  
from fastapi import Depends

api_router = APIRouter()


api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(upload.router , prefix="" ,tags=["upload"] ,dependencies=[Depends(get_current_user)])
api_router.include_router(file.router , prefix="/file" ,tags=["file"] )



