import request from "./request";

// 获取用户信息
export function getUserInfo() {
  return request({
    url: "/user/getCurrentUser",
    method: "GET",
  });
}

// 修改
export const updateUser = (data) => {
  return request({
    url: "/user/update",
    method: "PUT",
    data,
  });
};

// 修改用户基本信息
export const updateUserProfile = (data) => {
  return request({
    url: "/user/updateProfile",
    method: "PUT",
    data,
  });
};

// 修改用户密码
export const updateUserPwd = (data) => {
  return request({
    url: "/user/updatePwd",
    method: "PUT",
    data,
  });
};
