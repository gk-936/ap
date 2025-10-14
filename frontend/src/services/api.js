import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000, // 5 minutes
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);
            throw new Error(error.response.data.error || 'An error occurred');
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
            throw new Error('Network error - please check your connection');
        } else {
            // Other errors
            console.error('Error:', error.message);
            throw error;
        }
    }
);

export const scanUrl = async (url) => {
    const response = await api.post('/scan', { url });
    return response.data;
};

export const getScanHistory = async () => {
    const response = await api.get('/history');
    return response.data.history;
};

export const getVulnerabilities = async (scanId) => {
    const response = await api.get(`/vulnerabilities/${scanId}`);
    return response.data.vulnerabilities;
};

export const getDatabaseOverview = async () => {
    const response = await api.get('/database');
    return response.data;
};

export const checkApiStatus = async () => {
    const response = await api.get('/status');
    return response.data.status === 'ok';
};

export default api;