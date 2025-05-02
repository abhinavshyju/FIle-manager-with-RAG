
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from utils.auth import verify_token
from sqlmodel import Session, select
from db import get_session
from models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # Matches /login endpoint

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    email = verify_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
