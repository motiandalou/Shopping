import { createRoot } from "react-dom/client";
import App from "./page/App.tsx";
import "./styles/index.css";
import "./i18n/config";
import "./index.css";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

// 基础配置
NProgress.configure({
  // 取消右侧旋转加载圈
  showSpinner: false,
  minimum: 0.15,
  speed: 300,
});

createRoot(document.getElementById("root")!).render(<App />);
