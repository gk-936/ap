#!/bin/bash

# Web Vulnerability Scanner Startup Script

# Change to project root directory
cd "$(dirname "$0")/.."

echo "Starting Web Vulnerability Scanner..."
echo "======================================"

# Check if C++ scanner exists
if [ ! -f "./backend/vulnerability_scanner" ]; then
    echo "Building C++ scanner..."
    make
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    venv/bin/pip install flask flask-cors
fi

# Start Python API server in background using virtual environment
echo "Starting Python API server..."
venv/bin/python api/api_server.py &
API_PID=$!

# Wait for API server to start
sleep 3

# Start React frontend
echo "Starting React frontend..."
if [ "$USE_PRODUCTION" = "true" ]; then
    echo "Using production build..."
    (cd frontend && serve -s build -l 3000) &
    FRONTEND_PID=$!
else
    echo "Using development server..."
    (cd frontend && npm start) &
    FRONTEND_PID=$!
fi

# Wait for user input to stop
echo ""
echo "Services started:"
echo "- C++ Backend: ./backend/vulnerability_scanner"
echo "- Python Proxy: http://localhost:5000"
echo "- React Frontend: http://localhost:3000"
echo ""
echo "Architecture: React → Python Proxy → C++ Backend"
echo ""
echo "Press Enter to stop all services..."
read

# Kill background processes
echo "Stopping services..."
kill $API_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo "All services stopped."