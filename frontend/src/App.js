import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Search, History, Database, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import ScanForm from './components/ScanForm';
import ScanResults from './components/ScanResults';
import ScanHistory from './components/ScanHistory';
import DatabaseView from './components/DatabaseView';
import VulnerabilityTrends from './components/VulnerabilityTrends';

function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanResults, setScanResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScanner, setCurrentScanner] = useState('');

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
    setProgress(0);
    setCurrentScanner('');
    
    // Start real-time progress tracking
    const progressInterval = setInterval(async () => {
      try {
        const response = await axios.get('/api/progress');
        const { progress: currentProgress, scanner, total } = response.data;
        const percentage = (currentProgress / total) * 100;
        setProgress(percentage);
        setCurrentScanner(scanner);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }, 500);
    
    try {
      const response = await axios.post('/api/scan', { url });
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentScanner('Scan Complete');
      
      setTimeout(() => {
        setScanResults(response.data);
        setActiveTab('results');
        fetchScanHistory();
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error scanning URL:', error);
      alert('Error scanning URL: ' + (error.response?.data?.error || error.message));
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setCurrentScanner('');
      }, 1000);
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
          <button
            className={`btn ${activeTab === 'trends' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('trends')}
          >
            <TrendingUp size={16} style={{ marginRight: '8px' }} />
            Trends
          </button>
        </nav>
      </header>

      {loading && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ marginBottom: '20px', color: '#667eea' }}>Scanning in Progress</h3>
            
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e9ecef', 
              borderRadius: '10px', 
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            
            <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '8px' }}>
              {Math.round(progress)}% Complete
            </p>
            
            {currentScanner && (
              <p style={{ color: '#495057', fontWeight: '500' }}>
                Running: {currentScanner}
              </p>
            )}
          </div>
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

      {activeTab === 'trends' && (
        <VulnerabilityTrends />
      )}
    </div>
  );
}

export default App;