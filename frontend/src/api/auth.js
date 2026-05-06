import request from "./request";

// 员工登录
export const loginApi = (data) => {
  return request({
    url: "/auth/staff/login",
    method: "POST",
    data,
  });
};

// 员工退出登录
export const logoutApi = (data) => {
  return request({
    url: "/auth/staff/logout",
    method: "POST",
    data,
  });
};

// 获取 accessToken 来重新获取令牌
export const refreshTokenApi = (data) => {
  return request({
    url: "/auth/refreshToken",
    method: "POST",
    data,
  });
};
