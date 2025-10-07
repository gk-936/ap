import React, { useState, useEffect } from 'react';
import { Database, Eye, Calendar, AlertTriangle } from 'lucide-react';

function DatabaseView() {
  const [dbData, setDbData] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    try {
      const response = await fetch('/api/database');
      const data = await response.json();
      setDbData(data);
    } catch (error) {
      console.error('Error fetching database:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewScanDetails = async (scanId) => {
    try {
      const response = await fetch(`/api/vulnerabilities/${scanId}`);
      const data = await response.json();
      setVulnerabilities(data.vulnerabilities || []);
      setSelectedScan(scanId);
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error);
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      default: return 'severity-low';
    }
  };

  const downloadScanReport = async (scanId, url) => {
    try {
      const response = await fetch(`/api/vulnerabilities/${scanId}`);
      const data = await response.json();
      
      const report = {
        scan_id: scanId,
        url: url,
        scan_date: new Date().toISOString(),
        vulnerabilities: data.vulnerabilities || []
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `scan_${scanId}_report.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Loading database...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={24} />
          Database Overview
        </h2>

        {dbData && (
          <>
            <div className="grid grid-cols-3" style={{ marginBottom: '32px' }}>
              <div className="stat-card">
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
                  {dbData.stats.total_scans}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Scans</div>
              </div>
              
              <div className="stat-card">
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fd7e14' }}>
                  {dbData.stats.total_vulnerabilities}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Vulnerabilities</div>
              </div>
              
              <div className="stat-card">
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                  {dbData.stats.high_severity}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>High Severity</div>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              All Scans
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>URL</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Total</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>High</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Medium</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbData.scans.map((scan) => (
                    <tr key={scan.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px' }}>{scan.id}</td>
                      <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {scan.url}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {new Date(scan.scan_time).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                        {scan.total_vulns}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span className="severity-high">{scan.high_vulns}</span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span className="severity-medium">{scan.medium_vulns}</span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => viewScanDetails(scan.id)}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => downloadScanReport(scan.id, scan.url)}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedScan && vulnerabilities.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            Scan #{selectedScan} Vulnerabilities
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {vulnerabilities.map((vuln, index) => (
              <div key={index} className="vulnerability-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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

export default DatabaseView;