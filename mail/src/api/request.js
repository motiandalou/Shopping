import axios from "axios";
import { API_BASE_URL } from "../config";

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截：自动带上 token
service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：统一处理 401/403
service.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // 后端权限拦截：未登录 或 权限不足
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      localStorage.removeItem("token"); // 清除无效token
      // window.location.href = "/login"; // 跳回登录页
    }
    return Promise.reject(err);
  },
);

export default service;
