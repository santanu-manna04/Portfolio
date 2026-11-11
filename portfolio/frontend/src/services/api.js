import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  withCredentials: true, // HTTP-only cookie auth
  timeout: 15000,
});

export default api;
