// 存储 token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// 获取 token
export const getToken = () => {
  return localStorage.getItem("token");
};

// 删除 token（退出登录）
export const removeToken = () => {
  localStorage.removeItem("token");
};
