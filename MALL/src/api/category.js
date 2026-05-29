import request from "./request";

// 获取列表
export const getCategoryList = (data) => {
  return request({
    url: "/category/list",
    method: "GET",
    data,
  });
};

// 新增
export const addCategory = (data) => {
  return request({
    url: "/category/add",
    method: "POST",
    data,
  });
};

// 修改
export const update = (data) => {
  return request({
    url: "/category/update",
    method: "PUT",
    data,
  });
};

// 删除
export const deleteCategory = (id) => {
  return request({
    url: `/category/delete/${id}`,
    method: "DELETE",
  });
};
