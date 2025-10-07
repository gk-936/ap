#!/bin/bash

# Web Vulnerability Scanner Startup Script

# Get current directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Starting Web Vulnerability Scanner..."
echo "Project Root: $PROJECT_ROOT"
echo "======================================"

# Check if C++ scanner exists
if [ ! -f "./backend/vulnerability_scanner" ]; then
    echo "Building C++ scanner..."
    make || { echo "Build failed"; exit 1; }
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv || { echo "Virtual environment creation failed"; exit 1; }
    venv/bin/pip install flask flask-cors requests || { echo "Package installation failed"; exit 1; }
fi

# Start Python API server in background using virtual environment
echo "Starting Python API server..."
venv/bin/python api/api_server.py &
API_PID=$!

# Wait for API server to start with health check
echo "Waiting for API server to start..."
for i in {1..10}; do
    if curl -s http://localhost:5000/api/history >/dev/null 2>&1; then
        echo "API server is ready"
        break
    fi
    sleep 1
    if [ $i -eq 10 ]; then
        echo "API server failed to start"
        kill $API_PID 2>/dev/null
        exit 1
    fi
done

# Start React frontend
echo "Starting React frontend..."
if [ "$USE_PRODUCTION" = "true" ]; then
    echo "Using production build..."
    cd frontend
    if [ ! -d "build" ]; then
        echo "Building React app..."
        npm run build || { echo "Build failed"; exit 1; }
    fi
    npx serve -s build -l 3000 &
    FRONTEND_PID=$!
    cd ..
else
    echo "Using development server..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install || { echo "npm install failed"; exit 1; }
    fi
    npm start &
    FRONTEND_PID=$!
    cd ..
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

# Kill background processes and their children
echo "Stopping services..."
if [ ! -z "$API_PID" ]; then
    kill -TERM $API_PID 2>/dev/null || true
    wait $API_PID 2>/dev/null || true
fi
if [ ! -z "$FRONTEND_PID" ]; then
    kill -TERM $FRONTEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
fi

echo "All services stopped."