import request from "./request";

// 查询当前用户收藏列表
export const getFavoriteList = () => {
  return request({
    url: "/favorite/list",
    method: "GET",
  });
};

// 切换收藏/取消收藏
export const toggleFavorite = (goodsId) => {
  return request({
    url: "/favorite/toggle",
    method: "POST",
    params: {
      goodsId,
    },
  });
};

// 查询商品收藏状态（批量）
export const getBatchFavoriteState = (ids) => {
  return request({
    url: "/favorite/batchState",
    method: "POST",
    data: ids,
  });
};

// 删除单条收藏
export const deleteFavorite = (id) => {
  return request({
    url: `/favorite/delete/${id}`,
    method: "DELETE",
  });
};

// 清空当前用户所有收藏
export const clearFavorite = () => {
  return request({
    url: "/favorite/clear",
    method: "DELETE",
  });
};

// 后台分页查询收藏列表
export const getFavoriteBackList = (pageNum, pageSize) => {
  return request({
    url: "/favorite/backList",
    method: "GET",
    params: {
      pageNum,
      pageSize,
    },
  });
};
