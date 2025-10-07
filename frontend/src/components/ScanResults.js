import React from 'react';
import { AlertTriangle, Download, FileText } from 'lucide-react';

function ScanResults({ results, getSeverityIcon }) {
  const { scan_results = [], total_vulnerabilities = 0 } = results;

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      default:
        return 'severity-low';
    }
  };

  const downloadReport = (format) => {
    const data = format === 'json' ? JSON.stringify(results, null, 2) : generateCSV();
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnerability-report.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    const headers = 'Type,URL,Description,Severity,Timestamp\n';
    const rows = scan_results.map(vuln => 
      `"${vuln.type}","${vuln.url}","${vuln.description}","${vuln.severity}","${vuln.timestamp}"`
    ).join('\n');
    return headers + rows;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={24} />
          Scan Results
        </h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => downloadReport('json')}>
            <Download size={16} style={{ marginRight: '8px' }} />
            JSON
          </button>
          <button className="btn btn-secondary" onClick={() => downloadReport('csv')}>
            <FileText size={16} style={{ marginRight: '8px' }} />
            CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
            {total_vulnerabilities}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Vulnerabilities</div>
        </div>
        
        <div className="stat-card">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {scan_results.filter(v => v.severity === 'High').length}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>High Severity</div>
        </div>
        
        <div className="stat-card">
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fd7e14' }}>
            {scan_results.filter(v => v.severity === 'Medium').length}
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>Medium Severity</div>
        </div>
      </div>

      {scan_results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <AlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No vulnerabilities found. The target appears to be secure!</p>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Vulnerability Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {scan_results.map((vuln, index) => (
              <div key={index} className="vulnerability-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {getSeverityIcon(vuln.severity)}
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>{vuln.type}</span>
                  <span className={getSeverityClass(vuln.severity)}>
                    {vuln.severity}
                  </span>
                </div>
                
                <p style={{ marginBottom: '8px', color: '#495057' }}>
                  <strong>URL:</strong> {vuln.url}
                </p>
                
                <p style={{ marginBottom: '8px', color: '#495057' }}>
                  <strong>Description:</strong> {vuln.description}
                </p>
                
                <p style={{ fontSize: '14px', color: '#6c757d' }}>
                  <strong>Detected:</strong> {vuln.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanResults;