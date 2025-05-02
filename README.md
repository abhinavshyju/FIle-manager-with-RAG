# 📁 File Manager with RAG

An AI-powered file management system that leverages Retrieval-Augmented Generation (RAG) to enable intelligent interaction.

---

## 🚀 Features

* **Document Upload & Management**: Upload and organize various document types.
* **RAG Integration**: Enhance responses by combining retrieved documents with generative models.
* **User-Friendly Interface**: Intuitive frontend for seamless interaction.

---

## 🧱 Architecture Overview

The system is structured into three main components:

1. **Frontend**: Built with React.js and TypeScript, providing the user interface.
2. **Backend**: Developed using FastAPI (Python), handling API requests and business logic.
3. **Microservices**: Dedicated services for tasks like document processing and embedding generation.


---

## 🛠️ Setup Instructions



## Manual Setup

### Prerequisites

-   **Python**: Make sure Python (>=3.9) is installed on your system.
    
-   **Node.js**: Install Node.js (>=18) and npm for running the frontend.
    
-   **Git**: Required to clone the repository.
    
-   **pip**: Ensure `pip` is available to install Python dependencies.
    

----------

### Steps

1.  **Clone the Repository**:
    
    ```bash
    git clone https://github.com/abhinavshyju/FIle-manager-with-RAG.git
    cd FIle-manager-with-RAG
    
    ```
    

----------

2.  **Configure Backend**:
    
    ```bash
    cd backend
    cp .env.example .env
    
    ```
    
    -   Update `.env` with your specific configurations.
        
    -   Install dependencies:
        
        ```bash
        pip install -r requirements.txt
        
        ```
        
    -   Run backend server:
        
        ```bash
        uvicorn main:app --host 127.0.0.1 --port 8000 --reload
        
        ```
        

----------

3.  **Configure Microservice**:
    
    ```bash
    cd ../microservice
    cp .env.example .env
    
    ```
    
    -   Update `.env` with your specific configurations.
        
    -   Install dependencies:
        
        ```bash
        pip install -r requirements.txt
        
        ```
        
    -   Run microservice:
        
        ```bash
        uvicorn main:app --host 127.0.0.1 --port 8001 --reload
        
        ```
        

----------

4.  **Configure Frontend**:
    
    ```bash
    cd ../frontend
    cp .env.example .env
    
    ```
    
    -   Update `.env` with your specific configurations.
        
    -   Install dependencies:
        
        ```bash
        npm install
        
        ```
        
    -   Run frontend:
        
        ```bash
        npm run dev
        
        ```
        

# Docker Setup
It take too much time for building the docker (Not preferred for testing)


### Prerequisites

* **Docker**: Ensure Docker is installed on your system.
* **Git**: For cloning the repository.

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/abhinavshyju/FIle-manager-with-RAG.git
   cd FIle-manager-with-RAG
   ```



2. **Configure Environment Variables**:

   * Copy the example environment file and modify as needed:

     ```bash
     cp .env.example .env
     ```
   * Update `.env` with your specific configurations.

3. **Build and Run with Docker Compose**:

   ```bash
   docker-compose up --build
   ```



4. **Access the Application**:

   * Frontend: `http://localhost:5173`
   * Backend API: `http://localhost:8000/docs`

---


## 🚀 Deployment Guide

### Docker Deployment

The application is containerized using Docker for ease of deployment.

1. **Build and Run**:

   ```bash
   docker-compose up --build
   ```



2. **Environment Configuration**:

   * Ensure all necessary environment variables are set in the `.env` file.

