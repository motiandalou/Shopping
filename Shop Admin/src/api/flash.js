import request from "./request";

// 分页查询秒杀活动列表
export const getFlashActivityList = (params) => {
  return request({
    url: "/flash/activity/list",
    method: "POST",
    data: params,
  });
};

// 新增秒杀活动
export const addFlashActivity = (data) => {
  return request({
    url: "/flash/activity/add",
    method: "POST",
    data,
  });
};

// 修改秒杀活动
export const updateFlashActivity = (data) => {
  return request({
    url: "/flash/activity/update",
    method: "PUT",
    data,
  });
};

// 删除秒杀活动
export const deleteFlashActivity = (id) => {
  return request({
    url: `/flash/activity/delete/${id}`,
    method: "DELETE",
  });
};

// 给活动添加秒杀商品
export const addFlashSaleGoods = (data) => {
  return request({
    url: "/flash/goods/add",
    method: "POST",
    data,
  });
};

// 删除活动内秒杀商品
export const deleteFlashSaleGood = (id) => {
  return request({
    url: `/flash/goods/delete/${id}`,
    method: "DELETE",
  });
};
