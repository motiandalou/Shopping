import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthRoute from "./AuthRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Goods from "../pages/Goods";
import Order from "../pages/Order";
import User from "../pages/User";
import Category from "../pages/Category";
import Staff from "../pages/Staff";
import Service from "../pages/Service";

const router = createBrowserRouter([
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
      { path: "/", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "goods", element: <Goods /> },
      { path: "order", element: <Order /> },
      { path: "user", element: <User /> },
      { path: "category", element: <Category /> },
      { path: "service", element: <Service /> },
      { path: "staff", element: <Staff /> },
    ],
  },
]);

export default router;
