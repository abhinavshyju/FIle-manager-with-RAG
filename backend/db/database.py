import os
from sqlmodel import SQLModel ,create_engine,Session
from sqlalchemy import text 
from dotenv import load_dotenv
load_dotenv()

# Database URL for PostgreSQL
postgres_url = os.getenv("POSTGRES_URL")

# Create the database engine
engine = create_engine(postgres_url, echo=True)

# Enable vector extension
def enable_pgvector_extension():
    with Session(engine) as session:
        session.exec(text("CREATE EXTENSION IF NOT EXISTS vector;"))  
        session.commit()

# Create DB function
def create_db_and_tables():
    enable_pgvector_extension()
    SQLModel.metadata.create_all(engine)


# Session generator function
def get_session():
    with Session(engine) as session:
        yield session