from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from models import TextEmbedding
from sqlmodel import Session 
from db import engine




# Content spliting / turn the content into chunks
def split_text(text: str):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=200,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_text(text)
    return chunks

# Embedding model 
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


# Function to embed chuck and use store into db
def embed_and_store_chunks(text : str , user_id : int , document_id : int):
        chunks = split_text(text)
        with Session(engine) as session:
            for chunk in chunks:
                embedding = embedding_model.embed_query(chunk)
                text_embedding = TextEmbedding(content=chunk, embedding=embedding , user_id= user_id , document_id= document_id)    
                session.add(text_embedding)
            session.commit()
