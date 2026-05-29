import { Navigate } from "react-router-dom";
import { getRefreshToken, getAccessToken } from "../utils/token";

// 双Token校验：必须同时存在 accessToken 和 refreshToken 才算登录
export default function AuthRoute({ children }) {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();

  // 任意一个不存在 → 跳登录
  if (!refreshToken || !accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}
