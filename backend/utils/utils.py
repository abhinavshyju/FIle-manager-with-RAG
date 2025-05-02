import os
from langchain_huggingface import HuggingFaceEmbeddings
from sqlmodel import Session 
from db import engine
from langchain.prompts import ChatPromptTemplate
from sqlalchemy import text
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

# Embedding model 
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")



# Function to retriving chunks
def retrieve_relevant_chunks(query: str, user_id: int, document_id: Optional[int] = None , top_k: int = 5):
    query_embedding = embedding_model.embed_query(query)
    filter_condition = "document_id = :document_id" if document_id else "user_id = :user_id"
    
    query = text(f"""
        SELECT * FROM TextEmbedding 
        WHERE {filter_condition} 
        ORDER BY embedding <-> (:query_embedding)::vector 
        LIMIT :top_k
    """)
    
    params = {"query_embedding": query_embedding, "top_k": top_k}
    if document_id:
        params["document_id"] = document_id
    else:
        params["user_id"] = user_id

    with Session(engine) as session:
        results = session.exec(query.bindparams(**params))

    return [row.content for row in results]



# Chating function
def agent_chat(query: str, user_id: int, document_id: Optional[int] = None):
    if document_id :
        result = retrieve_relevant_chunks(query=query, user_id=user_id, document_id=document_id)
    else:
        result = retrieve_relevant_chunks(query=query, user_id=user_id)
    context_text = "\n\n---\n\n".join(result)
    # Prompt template
    PROMPT_TEMPLATE = """Use the following context to answer the question as accurately and thoroughly as possible. 
    If the answer cannot be found in the context, respond with "I don't know."

    Context:
    {context}

    Question: {question}

    Answer:
    """
  


    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query)


# This will help to run llm model in local , but it require some system requirements !! :)
##---------------------------------IF USING LLAMA MODEL IN LOCAL -------------------------------------------------##

# import re
# from transformers import pipeline
# from huggingface_hub import login

    # login("token_comes_here")
    # pipe = pipeline( task="text-generation", model="huggyllama/llama-7b" )

    # # Inference
    # output = pipe(prompt, max_new_tokens=200)

    # generated_text = output[0]["generated_text"]
    
    # match = re.search(r"Answer\s*(?:\([^)]+\))?\s*[:\n]\s*(.+)", generated_text.split("Question:")[-1], re.DOTALL)

    # if match:
    #     answer = match.group(1).strip()
    # else:
    #     answer = "No answer found."
##----------------------------------------------END-------------------------------------------------##

# Using gemini api to generate response 

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("Gemini API Key not provided")
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    answer = model.generate_content(prompt)

    return answer.text