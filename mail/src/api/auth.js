import request from "./request";

// 注册接口
export const registerApi = (data) => {
  return request({
    url: "/auth/user/register",
    method: "POST",
    data,
  });
};

// 登录接口
export const loginApi = (data) => {
  return request({
    url: "/auth/user/login",
    method: "POST",
    data,
  });
};

// 获取 accessToken 来重新获取令牌
export const refreshTokenApi = (refreshToken) => {
  return request({
    url: "/auth/refreshToken",
    method: "POST",
    data: { refreshToken },
  });
};
