from datetime import timedelta
import os
from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from minio import Minio
from sqlmodel import Session, and_ ,select
from db.database import get_session
from models import User ,Document
from utils import get_current_user
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
load_dotenv()
router = APIRouter()

@router.get("/all")
def get_file(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    total_statement = select(Document).where(Document.user_id == user.id)
    total_statement = session.exec(total_statement).all()
    total_files_count = len(total_statement)
    more_file:bool = (skip + limit) < total_files_count
    statement = (
        select(Document)
        .where(Document.user_id == user.id)
        .offset(skip)
        .limit(limit)
    )
    results = session.exec(statement)
    files = results.all()

    if not files:
        return JSONResponse(status_code=404, content={"message": "Files not found"})

    files_data = jsonable_encoder(files)

    return JSONResponse(status_code=200, content={
        "data": files_data,
        "pagination": {
            "skip": skip,
            "limit": limit,
            "count": len(files),
            "more_files": more_file 
        }
    })


@router.get("/search")
def search_files(
    query: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):  
    statement = (
        select(Document)
        .where(
            Document.user_id == user.id,
            Document.filename.ilike(f"%{query}%") 
        )
        .offset(skip)
        .limit(limit)
    )
    results = session.exec(statement)
    files = results.all()

    files_data = jsonable_encoder(files)

    count_statement = (
        select(Document)
        .where(
            Document.user_id == user.id,
            Document.filename.ilike(f"%{query}%")
        )
    )
    total_count = len(session.exec(count_statement).all())
    more_files = skip + limit < total_count

    return JSONResponse(
        status_code=200,
        content={
            "data": files_data,
            "pagination": {
                "skip": skip,
                "limit": limit,
                "count": len(files),
                "more_files": more_files,
            },
        },
    )

minio_client = Minio(
    endpoint= os.getenv("MINIO_URL") ,             
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=False                          
)

bucket_name = "uploads"
# Geting file temp url 
@router.get("/get-url")
async def get_file_url( 
    filename: str = Query(..., min_length=1),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)):

    statement = select(Document).where(and_(Document.filename == filename, Document.user_id == user.id))
    result = session.exec(statement).first()

    if not result:
        return JSONResponse(status_code=404, content={"error": "File not found"})

    try:
        url = minio_client.presigned_get_object(
            bucket_name,
            filename,
            expires=timedelta(days=1)
        )
        return JSONResponse(status_code=200, content={"url": url})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to generate URL: {str(e)}"})