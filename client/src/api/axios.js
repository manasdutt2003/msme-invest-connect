import axios from 'axios';

// Helper to construct full URL
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // If it's just a hostname (from Render), prepend https
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }
    // Append /api if missing (unless it's already there)
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
