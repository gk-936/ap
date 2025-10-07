import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Search, History, Database, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ScanForm from './components/ScanForm';
import ScanResults from './components/ScanResults';
import ScanHistory from './components/ScanHistory';
import DatabaseView from './components/DatabaseView';

function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanResults, setScanResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await axios.get('/api/history');
      setScanHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching scan history:', error);
    }
  };

  const handleScan = async (url) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/scan', { url });
      setScanResults(response.data);
      setActiveTab('results');
      fetchScanHistory(); // Refresh history
    } catch (error) {
      console.error('Error scanning URL:', error);
      alert('Error scanning URL: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <XCircle className="text-red-500" size={20} />;
      case 'medium':
        return <AlertTriangle className="text-orange-500" size={20} />;
      default:
        return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  return (
    <div className="container">
      <header className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Shield size={32} color="#667eea" />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748' }}>
            Web Vulnerability Scanner
          </h1>
        </div>
        
        <nav className="nav-tabs">
          <button
            className={`btn ${activeTab === 'scan' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('scan')}
          >
            <Search size={16} style={{ marginRight: '8px' }} />
            Scan
          </button>
          <button
            className={`btn ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('results')}
            disabled={!scanResults}
          >
            <AlertTriangle size={16} style={{ marginRight: '8px' }} />
            Results
          </button>
          <button
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={16} style={{ marginRight: '8px' }} />
            History
          </button>
          <button
            className={`btn ${activeTab === 'database' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('database')}
          >
            <Database size={16} style={{ marginRight: '8px' }} />
            Database
          </button>
        </nav>
      </header>

      {loading && (
        <div className="card loading">
          <div className="spinner"></div>
          <p style={{ marginLeft: '16px' }}>Scanning in progress...</p>
        </div>
      )}

      {activeTab === 'scan' && !loading && (
        <ScanForm onScan={handleScan} />
      )}

      {activeTab === 'results' && scanResults && (
        <ScanResults results={scanResults} getSeverityIcon={getSeverityIcon} />
      )}

      {activeTab === 'history' && (
        <ScanHistory history={scanHistory} onRefresh={fetchScanHistory} />
      )}

      {activeTab === 'database' && (
        <DatabaseView />
      )}
    </div>
  );
}

export default App;