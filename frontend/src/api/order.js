import request from "./request";

// 获取列表
export const getOrdersList = (params) => {
  return request({
    url: "/order/back/list",
    method: "GET",
    params,
  });
};

// 确认发货
export const updateOrders = (id, data) => {
  return request({
    url: `/order/back/updateStatus`,
    method: "post",
    params: {
      orderId: id,
      status: data.status,
      expressCompany: data.expressCompany,
      expressNo: data.expressNo,
    },
  });
};

// 查询物流
export const getLogistics = (id) => {
  return request({
    url: `/order/front/getLogistics/${id}`,
    method: "GET",
  });
};

// 删除
export const deleteOrders = (id) => {
  return request({
    url: `/order/delete/${id}`,
    method: "DELETE",
  });
};
