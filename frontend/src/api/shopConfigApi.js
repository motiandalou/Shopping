import request from "./request";

// 获取店铺配置详情
export const getShopConfigApi = () => {
  return request({
    url: "/shopConfig/detail",
    method: "GET",
  });
};

// 保存店铺配置
export const addShopConfigApi = (data) => {
  return request({
    url: "/shopConfig/add",
    method: "POST",
    data,
  });
};

// 修改店铺配置
export const updateShopConfigApi = (data) => {
  return request({
    url: "/shopConfig/update",
    method: "PUT",
    data,
  });
};
