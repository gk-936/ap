# C++ Web Vulnerability Scanner

A security tool that scans websites for common vulnerabilities including exposed sensitive files, directory traversal, and hardcoded credentials.

## Project Structure

```
vulnerability_scanner/
├── src/                        # C++ source code
│   └── vulnerability_scanner.cpp
├── backend/                    # Compiled binaries and database
│   ├── vulnerability_scanner   # C++ executable
│   └── vulnerabilities.db     # SQLite database
├── api/                       # Python proxy server
│   └── api_server.py          # Flask API bridge
├── frontend/                  # React web interface
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScanForm.js
│   │   │   ├── ScanResults.js
│   │   │   └── ScanHistory.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
├── config/                    # External configuration
│   ├── patterns.txt
│   ├── sensitive_files.txt
│   └── keywords.txt
├── scripts/                   # Startup and utility scripts
│   └── start_web_interface.sh
├── tests/                     # Test files
│   └── test_architecture.py
├── docs/                      # Documentation
├── reports/                   # Generated reports
├── logs/                      # Log files
├── venv/                      # Python virtual environment
└── Makefile                   # Build configuration
```

## Architecture

- **C++ Backend**: Handles all scanning logic, database, and report generation
- **Python Proxy**: Lightweight Flask server bridging React and C++
- **React Frontend**: Modern web interface with real-time progress
- **Dual Access**: Both CLI and web interface to the same C++ backend

## Installation

```bash
# Full setup
make setup

# Or step by step:
make install-deps    # Install system dependencies
make setup-python    # Setup Python virtual environment
make setup-frontend  # Setup React frontend
make all            # Build C++ scanner
```

## Usage

### CLI Mode
```bash
# Interactive mode
./backend/vulnerability_scanner

# Command line mode
./backend/vulnerability_scanner -u http://example.com -o json
```

### Web Interface
```bash
./scripts/start_web_interface.sh
# Access at http://localhost:3000
```

## Features

- **Directory Traversal Detection** - Tests for path traversal vulnerabilities
- **Sensitive File Exposure** - Checks for exposed configuration files, backups, and logs
- **Credential Detection** - Scans for hardcoded passwords, API keys, and tokens
- **SQL Injection Testing** - Detects SQL injection vulnerabilities
- **Cross-Site Scripting (XSS)** - Tests for XSS vulnerabilities
- **Command Injection** - Detects command injection vulnerabilities
- **Multiple Report Formats** - Console output, HTML, and JSON reports
- **Thread-Safe Operations** - Parallel scanning with mutex protection

## Testing

```bash
make test
```

## Build Commands

```bash
make           # Build project
make clean     # Remove compiled files
make help      # Show all available targets
```