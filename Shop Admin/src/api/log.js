// 日志
import request from "./request";

export const getLogList = () => {
  return request({
    url: "/log/list",
    method: "GET",
  });
};
