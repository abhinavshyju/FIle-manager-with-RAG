from fastapi import APIRouter
from db import get_session
from models.user import User
from schemas import UserCreate, UserLogin
from sqlmodel import Session , select 
from fastapi import Depends
from utils import create_access_token
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/register")
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if user:
        return JSONResponse(status_code=400 , content={"message" :"Email already registered"})
    new_user = User(name=user_data.name, email=user_data.email)
    new_user.set_password(user_data.password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "User created successfully"}

@router.post("/login")
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not user.check_password(data.password):
        return JSONResponse(status_code=400 , content={"message" :"Invalid credentials"})   
    access_token = create_access_token(data={"sub": user.email})
    return JSONResponse(status_code=200 , content={"access_token": access_token, "token_type": "bearer"})