import request from "./request";

// 获取数据概览
export const getStateList = () => {
  return request({
    url: "/dashboard/stats",
    method: "GET",
  });
};
