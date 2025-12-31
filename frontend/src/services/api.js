import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Articles API
export const articlesAPI = {
    // Get all articles
    getAll: async (params = {}) => {
        const response = await api.get('/articles', { params });
        return response.data;
    },

    // Get single article
    getById: async (id) => {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    },

    // Create article
    create: async (data) => {
        const response = await api.post('/articles', data);
        return response.data;
    },

    // Update article
    update: async (id, data) => {
        const response = await api.put(`/articles/${id}`, data);
        return response.data;
    },

    // Delete article
    delete: async (id) => {
        const response = await api.delete(`/articles/${id}`);
        return response.data;
    },

    // Trigger scraping
    scrape: async () => {
        const response = await api.post('/articles/scrape/trigger');
        return response.data;
    },
};

// Health check
export const healthCheck = async () => {
    const response = await api.get('/health');
    return response.data;
};

export default api;
