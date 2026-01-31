import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
};

// Onboarding APIs
export const onboardingAPI = {
    submit: (data) => api.post('/onboarding', data),
    get: () => api.get('/onboarding'),
    getStatus: () => api.get('/onboarding/status'),
};

// Dashboard APIs
export const dashboardAPI = {
    get: () => api.get('/dashboard'),
};

// University APIs
export const universityAPI = {
    discover: (params) => api.get('/universities/discover', { params }),
    getRecommendations: () => api.get('/universities/recommendations'),
    shortlist: (data) => api.post('/universities/shortlist', data),
    getShortlisted: () => api.get('/universities/shortlisted'),
    lock: (data) => api.post('/universities/lock', data),
    getLocked: () => api.get('/universities/locked'),
    unlock: (id) => api.post(`/universities/unlock/${id}`),
    remove: (id) => api.delete(`/universities/remove/${id}`),
};

// AI Counsellor APIs
export const aiAPI = {
    chat: (data) => api.post('/counsellor/chat', data),
    getHistory: (limit) => api.get('/counsellor/history', { params: { limit } }),
    clearHistory: () => api.delete('/counsellor/history'),
};

// Todo APIs
export const todoAPI = {
    create: (data) => api.post('/todos', data),
    getAll: (params) => api.get('/todos', { params }),
    get: (id) => api.get(`/todos/${id}`),
    update: (id, data) => api.patch(`/todos/${id}`, data),
    complete: (id) => api.post(`/todos/${id}/complete`),
    delete: (id) => api.delete(`/todos/${id}`),
};

export default api;
