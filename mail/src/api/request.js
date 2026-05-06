import axios from "axios";
import { API_BASE_URL } from "@/config";
import { refreshTokenApi } from "@/api/auth";

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截：自动带上 token
service.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截（双Token自动刷新 + 自动重发请求）
service.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    // 未登录 / 权限不足
    if (err.response) {
      const status = err.response.status;

      // 401 Token过期 → 自动刷新
      if (status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");

        // 没有刷新Token → 直接跳登录
        if (!refreshToken) {
          clearLoginInfo();
          return Promise.reject(err);
        }

        try {
          const { data } = await refreshTokenApi(refreshToken);
          const newToken = data.accessToken;
          localStorage.setItem("accessToken", newToken);
          err.config.headers.Authorization = "Bearer " + newToken;
          return service(err.config);
        } catch (e) {
          // 刷新失败 → 清空信息跳登录
          clearLoginInfo();
          console.error("Token refresh failed:", e);
        }
      }

      // ==================== 403 禁止访问 ====================
      if (status === 403) {
        console.error("403 Forbidden: 权限不足");
      }
    }

    return Promise.reject(err);
  },
);

// 封装：清除登录信息 + 跳登录
function clearLoginInfo() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

export default service;
