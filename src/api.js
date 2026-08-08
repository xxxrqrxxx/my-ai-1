import axios from 'axios';

const BASE_URL = 'https://my-ai-2-kwhk.onrender.com';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ===== 会话相关 =====
export const getSessions = () => api.get('/api/sessions').then(r => r.data);
export const createSession = (name) => api.post('/api/sessions', { name }).then(r => r.data);
export const deleteSession = (id) => api.delete(`/api/sessions/${id}`).then(r => r.data);
export const renameSession = (id, name) => api.patch(`/api/sessions/${id}`, { name }).then(r => r.data);

// ===== 消息相关 =====
export const getMessages = (sessionId) => api.get(`/api/messages/${sessionId}`).then(r => r.data);
export const sendMessage = (sessionId, message, model = 'qwen-plus') => 
    api.post('/api/chat', { sessionId, message, model }).then(r => r.data);

// ===== 记忆相关 =====
export const getMemories = () => api.get('/api/memories').then(r => r.data);
export const createMemory = (data) => api.post('/api/memories', data).then(r => r.data);
export const updateMemory = (id, data) => api.patch(`/api/memories/${id}`, data).then(r => r.data);
export const deleteMemory = (id) => api.delete(`/api/memories/${id}`).then(r => r.data);

// ===== 设置相关 =====
export const getSettings = () => api.get('/api/settings').then(r => r.data);
export const updateSettings = (data) => api.patch('/api/settings', data).then(r => r.data);
