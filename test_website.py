#!/usr/bin/env python3
from flask import Flask, request, render_template_string, send_file
import os

app = Flask(__name__)

# Vulnerable HTML templates
INDEX_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head><title>Vulnerable Test Site</title></head>
<body>
    <h1>Test Website for Vulnerability Scanner</h1>
    <p>This site contains intentional vulnerabilities for testing purposes.</p>
    
    <h2>Test Pages:</h2>
    <ul>
        <li><a href="/login">Login Page (Credential Detection)</a></li>
        <li><a href="/search?q=test">Search (XSS Vulnerable)</a></li>
        <li><a href="/user?id=1">User Profile (SQL Injection)</a></li>
        <li><a href="/file?path=test.txt">File Viewer (Directory Traversal)</a></li>
        <li><a href="/config.php">Config File</a></li>
        <li><a href="/.env">Environment File</a></li>
    </ul>
</body>
</html>
'''

LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head><title>Login</title></head>
<body>
    <h1>Login</h1>
    <form method="post">
        <input type="text" name="username" placeholder="Username"><br>
        <input type="password" name="password" placeholder="Password"><br>
        <input type="submit" value="Login">
    </form>
    
    <!-- Hardcoded credentials for testing -->
    <script>
        var api_key = "sk-1234567890abcdef";
        var password = "admin123";
        var secret_token = "secret_abc123";
    </script>
    
    <!-- Email in comments -->
    <!-- Contact: admin@testsite.com -->
</body>
</html>
'''

@app.route('/')
def index():
    return INDEX_TEMPLATE

@app.route('/login', methods=['GET', 'POST'])
def login():
    return LOGIN_TEMPLATE

@app.route('/search')
def search():
    query = request.args.get('q', '')
    # Vulnerable to XSS - directly embedding user input
    return f'''
    <html>
    <head><title>Search Results</title></head>
    <body>
        <h1>Search Results for: {query}</h1>
        <p>You searched for: {query}</p>
        <script>console.log("Search: {query}");</script>
    </body>
    </html>
    '''

@app.route('/user')
def user():
    user_id = request.args.get('id', '1')
    # Simulate SQL injection vulnerability
    if "'" in user_id or "union" in user_id.lower() or "select" in user_id.lower():
        return "SQL Error: You have an error in your SQL syntax near '" + user_id + "'", 500
    
    return f'''
    <html>
    <body>
        <h1>User Profile</h1>
        <p>User ID: {user_id}</p>
        <p>This page is vulnerable to SQL injection.</p>
    </body>
    </html>
    '''

@app.route('/file')
def file_viewer():
    file_path = request.args.get('path', '')
    
    # Vulnerable to directory traversal
    if '../' in file_path or '..\\' in file_path:
        try:
            # Simulate reading system files
            if 'etc/passwd' in file_path:
                return '''root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin'''
            elif 'etc/shadow' in file_path:
                return '''root:$6$xyz$hashedpassword:18000:0:99999:7:::
daemon:*:18000:0:99999:7:::'''
        except:
            pass
    
    return f'''
    <html>
    <body>
        <h1>File Viewer</h1>
        <p>Requested file: {file_path}</p>
        <p>This page is vulnerable to directory traversal.</p>
    </body>
    </html>
    '''

@app.route('/config.php')
def config():
    return '''<?php
// Database configuration
$db_host = "localhost";
$db_user = "admin";
$db_password = "supersecret123";
$db_name = "testdb";

// API Keys
$api_key = "sk-1234567890abcdef";
$secret_key = "secret_xyz789";

// Admin credentials
$admin_email = "admin@testsite.com";
$admin_password = "admin123";
?>'''

@app.route('/.env')
def env_file():
    return '''DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password123
API_KEY=sk-abcdef1234567890
SECRET_TOKEN=secret_token_xyz
ADMIN_EMAIL=admin@example.com
JWT_SECRET=jwt_secret_key_123'''

@app.route('/wp-config.php')
def wp_config():
    return '''<?php
define('DB_NAME', 'wordpress');
define('DB_USER', 'wp_user');
define('DB_PASSWORD', 'wp_password123');
define('DB_HOST', 'localhost');

define('AUTH_KEY', 'auth_key_12345');
define('SECURE_AUTH_KEY', 'secure_auth_key_67890');
?>'''

@app.route('/database.yml')
def database_yml():
    return '''production:
  adapter: mysql2
  database: myapp_production
  username: dbuser
  password: dbpassword123
  host: localhost
  
development:
  adapter: mysql2
  database: myapp_development
  username: devuser
  password: devpass456
  host: localhost'''

@app.route('/.git/config')
def git_config():
    return '''[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
[remote "origin"]
    url = https://user:token123@github.com/user/repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*'''

@app.route('/backup.sql')
def backup_sql():
    return '''-- Database backup
CREATE DATABASE testdb;
USE testdb;

CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users VALUES 
(1, 'admin', 'password123', 'admin@testsite.com'),
(2, 'user', 'secret456', 'user@testsite.com');

-- API Keys
-- Production API: api_key_prod_xyz789
-- Development API: api_key_dev_abc123'''

@app.route('/robots.txt')
def robots():
    return '''User-agent: *
Disallow: /admin/
Disallow: /config/
Disallow: /backup/
Disallow: /.env
Disallow: /database.yml

# Hidden directories
# /secret/
# /private/
# Admin panel: /admin/login.php'''

@app.route('/admin/login.php')
def admin_login():
    return '''<?php
// Admin login page
$admin_user = "administrator";
$admin_pass = "admin_password_2024";
$session_secret = "session_key_xyz123";

if ($_POST['username'] == $admin_user && $_POST['password'] == $admin_pass) {
    $_SESSION['admin'] = true;
    header('Location: /admin/dashboard.php');
}
?>
<html>
<body>
    <h1>Admin Login</h1>
    <form method="post">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Login">
    </form>
</body>
</html>'''

@app.route('/phpinfo.php')
def phpinfo():
    return '''<?php
phpinfo();
// This exposes system information
// Database: mysql://root:rootpass@localhost/webapp
// Redis: redis://localhost:6379/password=redis123
?>'''

@app.route('/test.php')
def test_php():
    return '''<?php
// Test file - should be removed in production
echo "System info: " . php_uname();
echo "Database password: dbpass123";
echo "API endpoint: https://api.example.com/v1?key=sk_test_1234";
?>'''

@app.route('/swagger.json')
def swagger():
    return '''{
  "swagger": "2.0",
  "info": {
    "title": "Test API",
    "version": "1.0.0"
  },
  "host": "api.testsite.com",
  "basePath": "/v1",
  "schemes": ["https"],
  "securityDefinitions": {
    "ApiKeyAuth": {
      "type": "apiKey",
      "in": "header",
      "name": "X-API-Key"
    }
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get users",
        "parameters": [
          {
            "name": "api_key",
            "in": "query",
            "required": true,
            "type": "string",
            "default": "sk_live_abcdef123456"
          }
        ]
      }
    }
  }
}'''

@app.route('/logs/error.log')
def error_log():
    return '''[2024-01-15 10:30:45] ERROR: Database connection failed
Host: localhost
User: webapp_user
Password: webapp_pass_2024
Database: production_db

[2024-01-15 10:31:02] ERROR: API authentication failed
API Key: sk_live_xyz789abc123
Secret: api_secret_key_456

[2024-01-15 10:31:15] ERROR: Redis connection timeout
Redis URL: redis://:redis_password_789@localhost:6379/0'''

@app.route('/package.json')
def package_json():
    return '''{
  "name": "vulnerable-app",
  "version": "1.0.0",
  "description": "Test application",
  "scripts": {
    "start": "node server.js",
    "dev": "NODE_ENV=development API_KEY=dev_key_123 node server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mysql": "^2.18.1"
  },
  "config": {
    "database_url": "mysql://user:password@localhost/testdb",
    "api_secret": "secret_token_production_xyz",
    "jwt_key": "jwt_signing_key_abc123"
  }
}'''

if __name__ == '__main__':
    print("Starting vulnerable test website...")
    print("Available at: http://localhost:5000")
    print("Use this URL to test your vulnerability scanner")
    print("\nNew vulnerable endpoints added:")
    print("- /backup.sql (Database backup with credentials)")
    print("- /admin/login.php (Admin credentials)")
    print("- /phpinfo.php (System information)")
    print("- /test.php (Development file with secrets)")
    print("- /swagger.json (API documentation with keys)")
    print("- /logs/error.log (Log files with credentials)")
    print("- /package.json (Node.js config with secrets)")
    app.run(host='0.0.0.0', port=5000, debug=True)