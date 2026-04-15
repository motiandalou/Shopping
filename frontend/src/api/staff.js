import request from "./request";

// 获取员工列表
export const getStaffList = (data) => {
  return request({
    url: "/staff/list",
    method: "POST",
    data,
  });
};

// 新增员工
export const addStaff = (data) => {
  return request({
    url: "/staff/add",
    method: "POST",
    data,
  });
};

// 修改员工
export const updateStaff = (data) => {
  return request({
    url: "/staff/update",
    method: "POST",
    data,
  });
};

// 修改密码
// export const updatePassword = (data) => {
//   return request({
//     url: "/staff/updatePassword",
//     method: "POST",
//     data,
//   });
// };

// 删除员工
export const deleteStaff = (id) => {
  return request({
    url: "/staff/delete",
    method: "DELETE",
    params: { id },
  });
};

// 员工登录
export const loginApi = (data) => {
  return request({
    url: "/staff/login",
    method: "POST",
    data,
  });
};

// 员工信息
export const getStaffInfo = () => {
  return request({
    url: "/staff/info",
    method: "GET",
  });
};
