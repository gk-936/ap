import React, { useState } from 'react';
import { Globe, Shield } from 'lucide-react';

function ScanForm({ onScan }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe size={24} />
        Start New Scan
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Target URL
          </label>
          <input
            type="url"
            className="input"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          <Shield size={16} style={{ marginRight: '8px' }} />
          Start Scan
        </button>
      </form>
      
      <div className="feature-list" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          Scanner Features:
        </h3>
        <ul>
          <li>✓ Directory Traversal Detection</li>
          <li>✓ Sensitive File Exposure</li>
          <li>✓ Credential Detection</li>
          <li>✓ SQL Injection Testing</li>
          <li>✓ Cross-Site Scripting (XSS)</li>
          <li>✓ Command Injection</li>
        </ul>
      </div>
    </div>
  );
}

export default ScanForm;