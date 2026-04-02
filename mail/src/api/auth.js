import request from "./request";

// 注册接口
export const registerApi = (data) => {
  return request({
    url: "/auth/register",
    method: "POST",
    data,
  });
};

// 登录接口
export const loginApi = (data) => {
  return request({
    url: "/auth/login",
    method: "POST",
    data,
  });
};
