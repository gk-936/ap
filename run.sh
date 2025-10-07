#!/bin/bash

# Vulnerability Scanner Launcher
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}C++ Web Vulnerability Scanner${NC}"
echo "=================================="

# Check if project is built
if [ ! -f "backend/vulnerability_scanner" ]; then
    echo -e "${YELLOW}Building project...${NC}"
    make all || { echo -e "${RED}Build failed${NC}"; exit 1; }
fi

# Ask user preference
echo ""
echo "Choose interface mode:"
echo "1) CLI - Command Line Interface"
echo "2) GUI - Web Interface"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo -e "${GREEN}Starting CLI mode...${NC}"
        ./backend/vulnerability_scanner
        ;;
    2)
        echo -e "${GREEN}Starting GUI mode...${NC}"
        
        # Setup Python environment if needed
        if [ ! -d "venv" ]; then
            echo -e "${YELLOW}Setting up Python environment...${NC}"
            make setup-python
        fi
        
        # Setup frontend if needed
        if [ ! -d "frontend/node_modules" ]; then
            echo -e "${YELLOW}Setting up frontend...${NC}"
            make setup-frontend
        fi
        
        # Build production version if needed
        if [ ! -d "frontend/build" ]; then
            echo -e "${YELLOW}Building React app for production...${NC}"
            cd frontend && npm run build && cd ..
        fi
        
        # Install serve if not available
        if ! command -v serve &> /dev/null; then
            echo -e "${YELLOW}Installing serve globally...${NC}"
            npm install -g serve
        fi
        
        export USE_PRODUCTION=true
        
        echo -e "${GREEN}Starting production web interface...${NC}"
        ./scripts/start_web_interface.sh
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run again and select 1 or 2.${NC}"
        exit 1
        ;;
esac