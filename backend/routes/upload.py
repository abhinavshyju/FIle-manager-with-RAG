import asyncio
from fastapi import APIRouter,File, UploadFile ,Depends
from minio import Minio
from minio.error import S3Error
import io
from sqlmodel import Session
from models import Document , User 
from utils import get_current_user
from db import get_session
import os 
router = APIRouter()
from fastapi.responses import  JSONResponse
import httpx
from dotenv import load_dotenv
load_dotenv()

minio_client = Minio(
    endpoint= os.getenv("MINIO_URL") ,             
    access_key=os.getenv("MINIO_ACCESS_KEY"),
    secret_key=os.getenv("MINIO_SECRET_KEY"),
    secure=False                          
)

bucket_name = os.getenv("MINIO_BUCKET_NAME")

if not minio_client.bucket_exists(bucket_name):
    minio_client.make_bucket(bucket_name)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...) , user: User = Depends(get_current_user) , session : Session = Depends(get_session)):
    try:
         # Read file content
        content = await file.read()
        file_obj = io.BytesIO(content)


         # Upload to bucket
        mini =  minio_client.put_object(
            bucket_name=bucket_name,
            object_name=file.filename,
            data=file_obj,
            length=len(content),
        )
        
        document = Document(user_id= user.id , filename= file.filename , type= file.content_type , size=file.size)

        session.add(document)
        session.commit()
        session.refresh(document)

        asyncio.create_task(call_extract_microservice(content, file.filename, document.id, user.id))
       

        return  JSONResponse(status_code=201 , content={"message" : "File uploaded successfully!"} )
    
    except S3Error as e:
        print(e)
        return {"error": str(e)}
    
async def call_extract_microservice(content, filename, document_id, user_id,):
    print("Request is sented")
    async with httpx.AsyncClient() as client:
        try:
            await client.post(
                f"{os.getenv("MICRO_SERVICE_URL")}/extract-json/",
                params={
                    "document_id": document_id,
                    "user_id": user_id,
                    "filename": filename
                },
                content=content,
                headers={"Content-Type": "application/octet-stream"},
            ) 
        except Exception as e:
            print(f"Failed to call extract microservice: {e}")