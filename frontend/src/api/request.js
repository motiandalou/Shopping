import axios from "axios";
import { API_BASE_URL } from "@/config";
import { refreshTokenApi } from "@/api/auth";

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截：自动带上 token —— 修复：刷新接口不带token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const isRefreshApi = config.url.includes("/refreshToken");

    // 刷新接口 不要带 accessToken，其他接口才带
    if (token && !isRefreshApi) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截（双Token自动刷新 + 自动重发请求）
service.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    if (err.response) {
      const status = err.response.status;
      const originalRequest = err.config;

      // 修复：401 / 403 都尝试刷新token
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        originalRequest._retry = true; // 防止重复刷新

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          clearLoginInfo();
          return Promise.reject(err);
        }

        try {
          // 调用刷新接口(带refreshToken:比如7天有效)，获取新的accessToken(比如15分钟有效)和refreshToken
          const { data } = await refreshTokenApi(refreshToken);
          const newAccessToken = data.accessToken;
          const newRefreshToken = data.refreshToken;

          localStorage.setItem("accessToken", newAccessToken);
          // refreshToken存储的原因: 经常使用系统的人,可以一直使用
          localStorage.setItem("refreshToken", newRefreshToken);

          // 重新发送失败的请求
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          return service(originalRequest);
        } catch (e) {
          // 刷新失败 → 退出登录
          clearLoginInfo();
        }
      }
    }

    return Promise.reject(err);
  },
);

// 清除登录信息 + 跳登录
function clearLoginInfo() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

export default service;
