import request from "./request";

// 获取闪购数据（
export const getFlashHomeData = () => {
  return request({
    url: "/flash/home",
    method: "GET",
  });
};

// 获取首页秒杀商品（取前4条）
export const getFlashSaleProductList = () => {
  return request({
    url: "/flash/home/goods",
    method: "GET",
    params: {
      pageNum: 1,
      pageSize: 4,
    },
  });
};

// 获取秒杀倒计时结束时间
export const getFlashDeadline = () => {
  return request({
    url: "/flash/home/deadline",
    method: "GET",
  });
};

// 获取首页热销商品
export const getBestSellingList = () => {
  return request({
    url: "/hot/list",
    method: "GET",
  });
};
