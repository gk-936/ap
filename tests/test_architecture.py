#!/usr/bin/env python3
"""
Test script to verify the new architecture:
C++ Backend + Python Proxy + React Frontend
"""

import subprocess
import json
import os
import time
import requests
import sys

def test_cpp_backend():
    """Test C++ scanner as backend"""
    print("Testing C++ Backend...")
    
    # Test help option
    result = subprocess.run(['./backend/vulnerability_scanner', '-h'], 
                          capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ C++ backend help failed")
        return False
    print("✅ C++ backend help works")
    
    # Test JSON output
    result = subprocess.run(['./backend/vulnerability_scanner', '-u', 'http://httpbin.org/get', '-o', 'json'], 
                          capture_output=True, text=True, timeout=30)
    if os.path.exists('reports/report.json'):
        print("✅ C++ backend JSON output works")
        return True
    else:
        print("❌ C++ backend JSON output failed")
        return False

def test_python_proxy():
    """Test Python proxy server"""
    print("\nTesting Python Proxy...")
    
    # Start proxy server
    proxy_process = subprocess.Popen(['/home/gokul/PycharmProjects/ap/venv/bin/python', 'api/api_server.py'])
    time.sleep(3)  # Wait for server to start
    
    try:
        # Test API endpoint
        response = requests.get('http://localhost:5000/api/history', timeout=5)
        if response.status_code == 200:
            print("✅ Python proxy API works")
            proxy_process.terminate()
            return True
        else:
            print("❌ Python proxy API failed")
            proxy_process.terminate()
            return False
    except Exception as e:
        print(f"❌ Python proxy connection failed: {e}")
        proxy_process.terminate()
        return False

def main():
    print("Architecture Test: C++ Backend + Python Proxy + React Frontend")
    print("=" * 60)
    
    # Test C++ backend
    cpp_ok = test_cpp_backend()
    
    # Test Python proxy
    python_ok = test_python_proxy()
    
    print("\n" + "=" * 60)
    print("Test Results:")
    print(f"C++ Backend: {'✅ PASS' if cpp_ok else '❌ FAIL'}")
    print(f"Python Proxy: {'✅ PASS' if python_ok else '❌ FAIL'}")
    
    if cpp_ok and python_ok:
        print("\n🎉 Architecture test PASSED!")
        print("Ready to use:")
        print("- CLI: ./backend/vulnerability_scanner")
        print("- Web: ./scripts/start_web_interface.sh")
        return 0
    else:
        print("\n❌ Architecture test FAILED!")
        return 1

if __name__ == '__main__':
    sys.exit(main())