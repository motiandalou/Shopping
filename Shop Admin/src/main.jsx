import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

// 基础配置
NProgress.configure({
  // 取消右侧旋转加载圈
  showSpinner: false,
  minimum: 0.15,
  speed: 300,
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
