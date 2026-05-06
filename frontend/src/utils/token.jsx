// 获取 refreshToken
export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// 获取 accessToken
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
