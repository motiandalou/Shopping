// 全局统一配置文件
const config = {
  // 后端接口基础配置
  api: {
    protocol: "http", // 协议 http / https
    host: "localhost", // 域名/IP
    port: "8081", // 后端端口
    prefix: "/api", // 接口前缀
  },

  // 前端项目配置
  app: {
    name: "Shopping Mall",
  },
};

// 拼接完整后端地址（自动组合）
export const API_BASE_URL = `${config.api.protocol}://${config.api.host}:${config.api.port}${config.api.prefix}`;

export default config;
