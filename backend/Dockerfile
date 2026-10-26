# Official lightweight Python image
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies AND root CA certificates for SSL/TLS
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY . .

# Cloud Run injects the PORT environment variable (default 8080)
EXPOSE 8080

# Run Uvicorn pointing to your FastAPI instance, respecting Cloud Run's $PORT
CMD ["sh", "-c", "python3 -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]