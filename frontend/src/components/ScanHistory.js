import React from 'react';
import { History, RefreshCw, ExternalLink } from 'lucide-react';

function ScanHistory({ history, onRefresh }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={24} />
          Scan History
        </h2>
        
        <button className="btn btn-secondary" onClick={onRefresh}>
          <RefreshCw size={16} style={{ marginRight: '8px' }} />
          Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <History size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No scan history available. Start your first scan!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  ID
                </th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  URL
                </th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  Scan Time
                </th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  Vulnerabilities
                </th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((scan) => (
                <tr key={scan.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>#{scan.id}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ExternalLink size={16} color="#6c757d" />
                      <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {scan.url}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#6c757d' }}>
                    {formatDate(scan.scan_time)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      backgroundColor: scan.vuln_count > 0 ? '#fee2e2' : '#f0f9ff',
                      color: scan.vuln_count > 0 ? '#dc2626' : '#0369a1'
                    }}>
                      {scan.vuln_count} found
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => window.open(scan.url, '_blank')}
                    >
                      View Site
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ScanHistory;