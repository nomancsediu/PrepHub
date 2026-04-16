import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});

adminApi.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token');
  if (token) cfg.headers['X-Admin-Token'] = token;
  return cfg;
});

export const getSubjects = () => api.get('subjects/');
export const getSubject = (slug) => api.get(`subjects/${slug}/`);
export const getLesson = (slug) => api.get(`lessons/${slug}/`);
export const getAdjacentLessons = (slug) => api.get(`lessons/${slug}/adjacent/`);
export const searchLessons = (q) => api.get(`lessons/search/?q=${encodeURIComponent(q)}`);

// Admin
export const adminLogin = (data) => api.post('admin/login/', data);
export const adminGetSubjects = () => adminApi.get('admin/subjects/');
export const adminCreateSubject = (d) => adminApi.post('admin/subjects/', d);
export const adminUpdateSubject = (id, d) => adminApi.put(`admin/subjects/${id}/`, d);
export const adminDeleteSubject = (id) => adminApi.delete(`admin/subjects/${id}/`);
export const adminGetTopics = () => adminApi.get('admin/topics/');
export const adminCreateTopic = (d) => adminApi.post('admin/topics/', d);
export const adminUpdateTopic = (id, d) => adminApi.put(`admin/topics/${id}/`, d);
export const adminDeleteTopic = (id) => adminApi.delete(`admin/topics/${id}/`);
export const adminGetLessons = () => adminApi.get('admin/lessons/');
export const adminCreateLesson = (d) => adminApi.post('admin/lessons/', d);
export const adminUpdateLesson = (id, d) => adminApi.put(`admin/lessons/${id}/`, d);
export const adminDeleteLesson = (id) => adminApi.delete(`admin/lessons/${id}/`);
export const aiChat = (message, context, history) =>
  api.post('ai/chat/', { message, context, history });
export const toggleLike = (slug, action) => api.post(`lessons/${slug}/like/`, { action });

export default api;
