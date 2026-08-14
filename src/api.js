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
export const sendMessage = (sessionId, message, model = 'glm-4.5-air', fileData = null) => 
    api.post('/api/chat', { sessionId, message, model, file_data: fileData }).then(r => r.data);


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

// MCP 服务器
export const getMcpServers = () => api.get('/api/mcp').then(r => r.data);
export const toggleMcpServer = (id) => api.patch(`/api/mcp/${id}/toggle`).then(r => r.data);
export const addMcpServer = (data) => api.post('/api/mcp', data).then(r => r.data);
export const deleteMcpServer = (id) => api.delete(`/api/mcp/${id}`).then(r => r.data);

// ===== 推送通知 =====
export async function getPushPublicKey() {
  const res = await axios.get(`${BASE_URL}/api/push/public-key`);
  return res.data.publicKey;
}

export async function subscribePush(subscription) {
  const res = await axios.post(`${BASE_URL}/api/push/subscribe`, subscription);
  return res.data;
}

export async function unsubscribePush() {
  const res = await axios.post(`${BASE_URL}/api/push/unsubscribe`);
  return res.data;
}

// ===== 悄悄话 =====
export async function getWhispers() {
  const res = await axios.get(`${BASE_URL}/api/whispers`);
  return res.data;
}

export async function createWhisper({ author = 'nana', content }) {
  const res = await axios.post(`${BASE_URL}/api/whispers`, { author, content });
  return res.data;
}

export async function replyWhisper(id, { author = 'nana', content }) {
  const res = await axios.patch(`${BASE_URL}/api/whispers/${id}/reply`, { author, content });
  return res.data;
}

// ===== 信件 =====
export async function getLetters() {
  const res = await axios.get(`${BASE_URL}/api/letters`);
  return res.data;
}

export async function createLetter({ author = 'nana', title, greeting, content, closing }) {
  const res = await axios.post(`${BASE_URL}/api/letters`, { author, title, greeting, content, closing });
  return res.data;
}
