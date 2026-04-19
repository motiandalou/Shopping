import request from "./request";

// 获取当前用户的购物车列表
export const getCartList = () => {
  return request({
    url: "/cart/list",
    method: "GET",
  });
};

// 加入购物车（新增）
export const addCart = (data) => {
  return request({
    url: "/cart/add",
    method: "POST",
    data,
  });
};

// 修改购物车（数量/选中状态）
export const updateCart = (data) => {
  return request({
    url: "/cart/update",
    method: "PUT",
    data,
  });
};

// 删除购物车
export const deleteCart = (id) => {
  return request({
    url: `/cart/delete/${id}`,
    method: "DELETE",
  });
};

// 清空购物车
export const clearCart = () => {
  return request({
    url: "/cart/clear",
    method: "DELETE",
  });
};
