from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from models import Document
from utils import extract_content_from_upload
from fastapi import Body, Query ,Depends 
from db import get_session
from sqlmodel import Session, select
import utils
import utils.utils
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI()

# Allow cross-origin 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract-json/")
async def extract_json(
    content: bytes = Body(...),
    document_id: int = Query(...),
    user_id: int = Query(...),
    filename: str = Query(...),
    session : Session = Depends(get_session)
):
    print(f"Received {len(content)} bytes from user {user_id}, document {document_id}")
    result = await extract_content_from_upload(content, filename)
    text_content = ""
    for item in result:
        text_content += item['text'] + " "

    utils.utils.embed_and_store_chunks(text_content , document_id= document_id, user_id =user_id)
    
    if result is not None:
        statement = select(Document).where(Document.id == document_id)
        files = session.exec(statement)
        file = files.first()

        if file is None:
            return JSONResponse(content={"error": "File not found"}, status_code=404)

        file.active = True
        session.commit()
        
        return JSONResponse( status_code=200 , content={"message" : "File activated successfully"})

    return JSONResponse(content={"error": "Extraction failed after retries"}, status_code=500)
