FROM python:3.11

WORKDIR /app

# Install system packages first (Debian-based)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-dev \
    curl \
    && apt-get clean

COPY requirements.txt .

# Use faster mirror if needed
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]