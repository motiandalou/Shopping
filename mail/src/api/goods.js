import request from "./request";

// 获取列表
export const getGoodsList = (data) => {
  return request({
    url: "/goods/list",
    method: "POST",
    data,
  });
};

// 获取详情
export const getGoodsDetail = (id) => {
  return request({
    url: `/goods/detail/${id}`,
    method: "GET",
  });
};

// 新增
export const addGoods = (data) => {
  return request({
    url: "/goods/add",
    method: "POST",
    data,
  });
};

// 修改
export const updateGoods = (data) => {
  return request({
    url: "/goods/update",
    method: "PUT",
    data,
  });
};

// 删除
export const deleteGoods = (id) => {
  return request({
    url: `/goods/delete/${id}`,
    method: "DELETE",
  });
};
