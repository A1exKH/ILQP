#!/bin/bash

echo "### Starting ILQP React Frontend..."

# Navigate to frontend directory relative to project root
cd "$(dirname "$0")/../frontend" || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Warning: node_modules not found. Installing dependencies..."
    npm install
fi

# Start Vite dev server
echo "### Launching Vite dev server on http://localhost:5173..."
npm run dev