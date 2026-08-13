import axios from 'axios';

// 本地开发用 localhost，部署上线后改回 Render 地址
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
export const sendMessage = (sessionId, message, model = 'gemini-2.0-flash') => 
    api.post('/api/chat', { sessionId, message, model }).then(r => r.data);

// ===== 记忆相关 =====
export const getMemories = (category, search) => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    return api.get('/api/memories', { params }).then(r => r.data);
};
export const createMemory = (data) => api.post('/api/memories', data).then(r => r.data);
export const updateMemory = (id, data) => api.patch(`/api/memories/${id}`, data).then(r => r.data);
export const deleteMemory = (id) => api.delete(`/api/memories/${id}`).then(r => r.data);

// ===== 设置相关 =====
export const getSettings = () => api.get('/api/settings').then(r => r.data);
export const updateSettings = (data) => api.patch('/api/settings', data).then(r => r.data);

// ===== 心智相关（心潮） =====
export const getMindState = () => api.get('/api/mind/state').then(r => r.data);
export const getMindIntent = () => api.get('/api/mind/intent').then(r => r.data);

// ===== 手机活动 =====
export const getActivitySummary = () => api.get('/api/activity/summary').then(r => r.data);

export const getUsage = () => api.get('/api/usage').then(r => r.data);
