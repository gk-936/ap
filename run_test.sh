#!/bin/bash

echo "=== Vulnerability Scanner Test ==="
echo ""

# Check if scanner is compiled
if [ ! -f "./vulnerability_scanner" ]; then
    echo "Compiling vulnerability scanner..."
    make
    if [ $? -ne 0 ]; then
        echo "Failed to compile scanner. Make sure dependencies are installed:"
        echo "sudo apt-get install libcurl4-openssl-dev libsqlite3-dev build-essential"
        exit 1
    fi
fi

# Check if test website is running
echo "Checking if test website is running..."
if ! curl -s http://localhost:5000/ > /dev/null; then
    echo "Test website is not running. Starting it..."
    echo "Please run './start_test_site.sh' in another terminal first"
    echo "Then run this script again"
    exit 1
fi

echo "Test website is running. Starting vulnerability scan..."
echo ""

# Run the scanner with test URLs
echo "3" | ./vulnerability_scanner << EOF
test_urls.txt
y
EOF

echo ""
echo "=== Test Complete ==="
echo "Check the generated reports:"
echo "- report.html (HTML report)"
echo "- report.json (JSON report)"
echo "- vulnerabilities.db (SQLite database)"