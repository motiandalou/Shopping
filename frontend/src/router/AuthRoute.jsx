import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";

// 有 token 正常显示，没有跳去登录
export default function AuthRoute({ children }) {
  const token = getToken();
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
  return children;
}
