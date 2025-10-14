# Vulnerability Scanner Makefile

# Compiler settings
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
CURL_FLAGS = $(shell pkg-config --cflags --libs libcurl)
SQLITE_FLAGS = $(shell pkg-config --libs sqlite3)
LIBS = $(CURL_FLAGS) $(SQLITE_FLAGS) -lpthread

# Directories
SRC_DIR = src
BACKEND_DIR = backend
BUILD_DIR = build

# Source and target
SOURCE = $(SRC_DIR)/vulnerability_scanner.cpp
TARGET = $(BACKEND_DIR)/vulnerability_scanner

# Default target
all: $(TARGET)

# Build the scanner
$(TARGET): $(SOURCE)
	@mkdir -p $(BACKEND_DIR) logs reports config
	$(CXX) $(CXXFLAGS) $(SOURCE) $(LIBS) -o $(TARGET)
	@echo "✅ Vulnerability scanner built successfully"

# Clean build artifacts
clean:
	rm -f $(TARGET) $(BACKEND_DIR)/*.db $(BACKEND_DIR)/*.html reports/*.json logs/*.log
	@echo "🧹 Cleaned build artifacts"

# Install dependencies (Ubuntu/Debian)
install-deps:
	sudo apt-get update
	sudo apt-get install -y libcurl4-openssl-dev libsqlite3-dev build-essential

# Setup Python environment
setup-python:
	python3 -m venv venv
	venv/bin/pip install flask flask-cors requests

# Setup React frontend
setup-frontend:
	cd frontend && npm install

# Full setup
setup: install-deps setup-python setup-frontend all
	@echo "🎉 Full setup completed"

# Run tests
test:
	venv/bin/python tests/test_architecture.py

# Help
help:
	@echo "Available targets:"
	@echo "  all           - Build the vulnerability scanner"
	@echo "  clean         - Remove build artifacts"
	@echo "  install-deps  - Install system dependencies"
	@echo "  setup-python  - Setup Python virtual environment"
	@echo "  setup-frontend- Setup React frontend"
	@echo "  setup         - Full project setup"
	@echo "  test          - Run architecture tests"
	@echo "  help          - Show this help"

.PHONY: all clean install-deps setup-python setup-frontend setup test help