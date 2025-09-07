#!/bin/bash

echo "Installing Flask if not already installed..."
pip3 install flask

echo "Starting vulnerable test website..."
echo "The website will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""

python3 test_website.py