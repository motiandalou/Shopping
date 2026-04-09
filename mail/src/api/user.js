import request from "./request";

// 注册接口
export const registerApi = (data) => {
  return request({
    url: "/user/register",
    method: "POST",
    data,
  });
};

// 登录接口
export const loginApi = (data) => {
  return request({
    url: "/user/login",
    method: "POST",
    data,
  });
};

// 获取列表
export const getUserList = (data) => {
  return request({
    url: "/user/list",
    method: "POST",
    data,
  });
};

// 修改
export const updateUser = (data) => {
  return request({
    url: "/user/update",
    method: "PUT",
    data,
  });
};

// 修改用户状态
export const updateUserStatus = (data) => {
  return request({
    url: "/user/updateStatus",
    method: "PUT",
    data,
  });
};
