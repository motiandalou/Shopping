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
export const getLogistics = (shipperCode, logisticCode) => {
  return request({
    url: `/logistics/track/${shipperCode}/${logisticCode}`,
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

// 售后工单列表
export const refundOrderList = (params) => {
  return request({
    url: "/order/back/refund/list",
    method: "GET",
    params,
  });
};

// 工单日志列表
export const getOrderLogList = (params) => {
  return request({
    url: "/order/log/list",
    method: "GET",
    params: params,
  });
};

// 2. 售后工单详情
export const refundDetail = (orderId) => {
  return request({
    url: "/order/back/refund/detail",
    method: "get",
    params: { orderId },
  });
};

// 3. 审核退款（同意 / 拒绝）
export const auditRefund = (orderId, refundStatus, refundRemark) => {
  return request({
    url: "/order/back/refund/audit",
    method: "post",
    params: {
      orderId,
      refundStatus,
      refundRemark,
    },
  });
};
