import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getSessions = () => api.get('/api/sessions').then(r => r.data);
export const createSession = (name) => api.post('/api/sessions', { name }).then(r => r.data);
export const deleteSession = (id) => api.delete(`/api/sessions/${id}`).then(r => r.data);
export const renameSession = (id, name) => api.patch(`/api/sessions/${id}`, { name }).then(r => r.data);
export const getMessages = (sessionId) => api.get(`/api/messages/${sessionId}`).then(r => r.data);
export const sendMessage = (sessionId, message, model = 'qwen-plus') => 
    api.post('/api/chat', { sessionId, message, model }).then(r => r.data);
