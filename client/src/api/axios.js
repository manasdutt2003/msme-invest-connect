import axios from 'axios';

const api = axios.create({
    // Use VITE_API_URL environment variable if available, otherwise default to localhost
    baseURL: import.meta.env.VITE_API_URL || 'https://msme-invest-connect-1.onrender.com/api',
    timeout: 5000, // 5 seconds timeout
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
