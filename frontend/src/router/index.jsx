import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthRoute from "./AuthRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Goods from "../pages/Goods";
import Order from "../pages/Order";
import User from "../pages/User";
import Category from "../pages/Category";
import Profile from "@/pages/System/Profile";
import Staff from "@/pages/System/Staff";
import ShopConfig from "@/pages/System/ShopConfig";
import OrderRule from "@/pages/System/OrderRule";
import StockWarning from "@/pages/System/StockWarning";
import OperationLog from "@/pages/System/OperationLog";

import ServiceChat from "@/pages/Service/chat";
import ServiceTicket from "@/pages/Service/ticket";
import ServiceAudit from "@/pages/Service/audit";
import ServiceRefund from "@/pages/Service/refund";
import ServiceTrace from "@/pages/Service/trace";

import NotFound from "@/pages/404";

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
      {
        path: "/service",
        element: <Outlet />,
        children: [
          { path: "chat", element: <ServiceChat /> },
          { path: "ticket", element: <ServiceTicket /> },
          { path: "audit", element: <ServiceAudit /> },
          { path: "refund", element: <ServiceRefund /> },
          { path: "trace", element: <ServiceTrace /> },
        ],
      },
      {
        path: "/system",
        element: <Outlet />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "staff", element: <Staff /> },
          { path: "shop", element: <ShopConfig /> },
          { path: "order-rule", element: <OrderRule /> },
          { path: "stock", element: <StockWarning /> },
          { path: "log", element: <OperationLog /> },
        ],
      },
      // 404 页面
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
