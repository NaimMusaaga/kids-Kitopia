import axios from 'axios';

// في التطوير: الباك اند على المنفذ 5000. في الإنتاج: نفس النطاق (السيرفر يخدم الواجهة والـ API معاً)
// ويمكن تغييره بالمتغير VITE_API_URL عند نشر الواجهة على نطاق منفصل.
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({ baseURL: API_URL });

// نرسل التوكن مع كل طلب
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* التخزين غير متاح */ }
  return config;
});

// إذا انتهت صلاحية الجلسة نُسجّل الخروج ونعيد المستخدم لصفحة الدخول
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith('/api/auth');
    if (error.response?.status === 401 && !isAuthCall && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default api;

// تسجيل مشاهدة فيديو لمستخدم مسجّل (لسجل المشاهدة والتوصيات)؛ الفشل لا يهم
export const recordWatch = (videoId) => api.post(`/api/videos/${videoId}/watch`).catch(() => {});
