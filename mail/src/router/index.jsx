import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthRoute from "./AuthRoute";

// 页面
import Login from "../pages/Login";
import ProductList from "../pages/ProductList";
import Goods from "../pages/Goods";
import Order from "../pages/Order";
import User from "../pages/User";
import Category from "../pages/Category";

const router = createBrowserRouter([
  // 登录注册（不需要守卫）
  { path: "/login", element: <Login /> },

  // 需要登录才能访问的页面
  {
    path: "/",
    element: (
      <AuthRoute>
        <MainLayout />
      </AuthRoute>
    ),
    children: [
      { path: "/", element: <ProductList /> },
      { path: "goods", element: <Goods /> },
      { path: "order", element: <Order /> },
      { path: "user", element: <User /> },
      { path: "category", element: <Category /> },
    ],
  },
]);

export default router;
