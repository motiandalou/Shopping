import axios from "axios";
import { API_BASE_URL } from "../config";

const service = axios.create({
  baseURL: API_BASE_URL, // 这里自动用统一配置
  timeout: 10000,
});

// 请求拦截
service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截
service.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err),
);

export default service;
