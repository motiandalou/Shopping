import request from "./request";

// 获取全部商品下拉选择列表
export const getAllGoodsSelect = () => {
  return request({
    url: "/goods/all-select",
    method: "GET",
  });
};
