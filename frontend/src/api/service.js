import request from "./request";

// 获取客服会话列表
export const getChatSessions = (params) => {
  return request({
    url: `/chat/sessions`,
    method: "GET",
    params,
  });
};

// 获取会话的历史消息
export const getChatMessages = (params) => {
  return request({
    url: "/chat/messages",
    method: "GET",
    params,
  });
};

// 获取会话的历史消息
export const clearUnread = (params) => {
  return request({
    url: "/chat/clearUnread",
    method: "GET",
    params,
  });
};

// 获取用户状态
export const getUserStatus = () => {
  return request({
    url: "/chat/user/status",
    method: "GET",
  });
};
