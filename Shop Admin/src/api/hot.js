import request from "./request";

// 分页查询热销商品列表
export const getHotGoodsPage = (params) => {
  return request({
    url: "/admin/hot/page",
    method: "GET",
    params,
  });
};

// 新增热销商品
export const addHotGoods = (data) => {
  return request({
    url: "/admin/hot/add",
    method: "POST",
    data,
  });
};

// 修改热销商品排序权重
export const updateHotSort = (data) => {
  return request({
    url: "/admin/hot/sort",
    method: "PUT",
    data,
  });
};

// 移除热销商品
export const deleteHotGoods = (id) => {
  return request({
    url: `/admin/hot/${id}`,
    method: "DELETE",
  });
};

// 获取全部商品下拉选择列表
export const getAllGoodsSelect = () => {
  return request({
    url: "/goods/all-select",
    method: "GET",
  });
};
