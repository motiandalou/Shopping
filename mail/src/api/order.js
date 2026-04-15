import request from "../../../frontend/src/api/request";

// 获取列表
export const getOrdersList = (params) => {
  return request({
    url: "/order/back/list",
    method: "GET",
    params,
  });
};

// 修改
export const updateOrders = (id) => {
  return request({
    url: `/order/back/updateStatus${id}`,
    method: "PUT",
  });
};

// 删除
export const deleteOrders = (id) => {
  return request({
    url: `/order/delete/${id}`,
    method: "DELETE",
  });
};
