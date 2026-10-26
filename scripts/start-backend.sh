#!/bin/bash

echo "### Starting ILQP FastAPI Backend..."

# Navigate to backend directory relative to project root
cd "$(dirname "$0")/../backend" || exit

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment 'venv' not found in backend/. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    # Activate virtual environment
    source venv/bin/activate
fi

# Start Uvicorn development server
echo "### Launching Uvicorn on http://127.0.0.1:8010..."
python3 -m uvicorn app.main:app --reload --port 8010