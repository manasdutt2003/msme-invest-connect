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
    },
    withCredentials: true // Important for sending cookies
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        // We're moving away from localStorage, but for now, let's keep using it 
        // if we decide to store the SHORT-LIVED access token there. 
        // Ideally, it should be in memory, but localStorage is fine for short-lived if we clear it.
        // Actually, the plan said "Remove LocalStorage Token". 
        // BUT, we need a place to store the access token client side. 
        // Common pattern: Store Access Token in variable (closure) or Context, but that wipes on refresh.
        // For simplicity and resilience in this iteration without Redux: 
        // We will stick to localStorage for the ACCESS token (15m life), 
        // but rely on the HttpOnly cookie for the refresh.
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Silent Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Verify if it's a 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint - cookie will be sent automatically thanks to withCredentials: true
                const response = await api.get('/auth/refresh');
                const newAccessToken = response.data.token;

                // Update localStorage with new token
                localStorage.setItem('token', newAccessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                // Refresh failed (cookie expired or invalid)
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login'; // Force redirect to login
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
