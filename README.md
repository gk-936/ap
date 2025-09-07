# C++ Web Vulnerability Scanner

A security tool that scans websites for common vulnerabilities including exposed sensitive files, directory traversal, and hardcoded credentials.

## Features

- **Directory Traversal Detection** - Tests for path traversal vulnerabilities
- **Sensitive File Exposure** - Checks for exposed configuration files, backups, and logs
- **Credential Detection** - Scans for hardcoded passwords, API keys, and tokens
- **Multiple Report Formats** - Console output and HTML reports
- **Object-Oriented Design** - Demonstrates inheritance, polymorphism, and abstraction

## Prerequisites

### System Requirements
- Linux/Ubuntu (recommended) or macOS
- C++ compiler (g++)
- libcurl development libraries
- Python 3 (for test website)

### Dependencies
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install libcurl4-openssl-dev build-essential

# macOS
brew install curl
```

## Installation

1. **Clone or download the project files**
```bash
mkdir vulnerability_scanner
cd vulnerability_scanner
```

2. **Compile the scanner**
```bash
make
```

3. **Verify installation**
```bash
./vulnerability_scanner
```

## Usage

### Basic Scanning

1. **Start the test website** (optional)
```bash
python3 test_website.py
```

2. **Run the scanner**
```bash
./vulnerability_scanner
```

3. **Enter target URL**
```
Enter URL to scan: http://localhost:5000
```

4. **View results**
- Console report displays immediately
- Optional HTML report saved as `report.html`

## Code Architecture

### Project Structure
```
vulnerability_scanner/
├── vulnerability_scanner.cpp    # Main scanner implementation
├── test_website.py             # Vulnerable test website
├── Makefile                    # Build configuration
└── README.md                   # This file
```

### Class Hierarchy

#### Vulnerability Classes
```cpp
BaseVulnerability (Abstract)
├── Vulnerability
    ├── HighSeverityVulnerability
    └── MediumSeverityVulnerability
```

#### Scanner Classes
```cpp
BaseScanner (Abstract)
├── DirectoryTraversalScanner
├── SensitiveFileScanner
└── CredentialScanner
```

#### HTTP Client
```cpp
IHttpClient (Interface)
└── CurlHttpClient
```

#### Report Generators
```cpp
IReportGenerator (Interface)
├── ConsoleReportGenerator
└── HTMLReportGenerator
```

### Key Components

#### 1. Vulnerability Detection
```cpp
class BaseVulnerability {
protected:
    string type, url, description, severity, timestamp;
public:
    BaseVulnerability(string t, string u, string d, string s);
    virtual string getDetails() = 0;  // Pure virtual function
};
```

#### 2. Scanner Implementation
```cpp
class DirectoryTraversalScanner : public BaseScanner {
private:
    vector<string> patterns = {"../", "..\\", "%2e%2e%2f"};
public:
    vector<BaseVulnerability*> scan(string url) override;
};
```

#### 3. HTTP Client
```cpp
class CurlHttpClient : public IHttpClient {
public:
    string makeRequest(string url) override;
    int getResponseCode(string url) override;
};
```

## Detected Vulnerabilities

### Directory Traversal
- Tests common traversal patterns: `../`, `..\\`, `%2e%2e%2f`
- Attempts to access `/etc/passwd`
- Severity: High

### Sensitive File Exposure
- Configuration files: `.env`, `config.php`, `wp-config.php`
- Backup files: `backup.sql`, `database.yml`
- Development files: `test.php`, `phpinfo.php`
- API documentation: `swagger.json`
- Log files: `logs/error.log`
- Git configuration: `.git/config`
- Severity: High

### Credential Detection
- Passwords, API keys, tokens
- Database connection strings
- Authentication keys
- Email addresses
- Severity: Medium

## Configuration

### Adding New Sensitive Files
```cpp
// In SensitiveFileScanner constructor
files = {"/etc/passwd", "/.env", "/config.php", "/new-file.txt"};
```

### Adding New Credential Keywords
```cpp
// In CredentialScanner constructor
keywords = {"password", "api_key", "secret", "new_keyword"};
```

## Build Commands

```bash
make                    # Build project
make clean             # Remove compiled files
g++ -std=c++17 -Wall -Wextra -O2 -o vulnerability_scanner vulnerability_scanner.cpp -lcurl -lpthread
```

## Testing

The included test website (`test_website.py`) provides various vulnerable endpoints:

- `/` - Main page with credentials
- `/.env` - Environment file
- `/config.php` - PHP configuration
- `/backup.sql` - Database backup
- `/admin/login.php` - Admin panel
- `/swagger.json` - API documentation

## Output Examples

### Console Output
```
=== VULNERABILITY SCAN REPORT ===
Total vulnerabilities found: 5

Severity breakdown:
  High: 3
  Medium: 2

CRITICAL: Sensitive File Exposure at http://localhost:5000/.env - IMMEDIATE ACTION REQUIRED
  Description: Sensitive file found: /.env
  Time: Mon Jan 15 10:30:45 2024
```

### HTML Report
Generated as `report.html` with tabular format showing vulnerability type, URL, description, and severity.

## Troubleshooting

### Common Issues

**Compilation Error: curl/curl.h not found**
```bash
sudo apt-get install libcurl4-openssl-dev
```

**Compilation Error: make command not found**
```bash
sudo apt-get install build-essential
```
**Runtime Error: Segmentation fault**
- Check for null pointer access
- Verify proper memory management
- Ensure objects are not used after deletion
