import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Layout, Button, Dropdown, Menu, message, Input, Badge } from "antd";
import {
  UserOutlined,
  OrderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Login from "@/pages/Login";
import Goods from "@/pages/goods";
import Cart from "@/pages/Cart";
import Order from "@/pages/Order";
import OrderList from "@/pages/OrderList";
import GoodsDetail from "@/pages/Goods/detail";
import OrderDetail from "@/pages/OrderList/detail";
import ChatPage from "@/pages/Chat";
import MailSideFloatBar from "@/components/MailSideFloatBar";
import MailTopMiniNav from "@/components/MailTopMiniNav";
import "./App.css";
import { getRefreshToken, getAccessToken } from "@/utils/token";

const { Header, Content, Footer } = Layout;

// 路由守卫
const PrivateRoute = ({ children }) => {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();

  // 任意一个不存在 → 跳登录
  if (!refreshToken || !accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
};

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // 判断是否是登录页
  const isLoginPage = location.pathname === "/login";

  // 退出登录
  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    message.success("退出登录成功");
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => navigate("/orders")}>我的订单</Menu.Item>
      <Menu.Item onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    navigate(`/?search=${searchValue}`);
  };

  // 登录页单独渲染，不包裹 Layout
  if (isLoginPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    );
  }

  // 其他页面走正常电商布局
  return (
    <Layout className="jd-layout">
      <MailTopMiniNav />

      <Header className="jd-top-header">
        <div className="jd-header-container">
          <div
            className="jd-logo"
            onClick={() => navigate("/")}
          >
            <span className="jd-logo-text">MALL</span>
          </div>

          <div className="jd-search-box">
            <Input
              placeholder="凡士林身体乳"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              className="jd-search-input"
            />
            <Button
              type="primary"
              className="jd-search-btn"
              onClick={handleSearch}
            >
              搜索
            </Button>
          </div>
        </div>
      </Header>

      <Content className="jd-content">
        <Routes>
          <Route
            path="/"
            element={<Goods />}
          />
          <Route
            path="/goods/detail/:id"
            element={<GoodsDetail />}
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/order"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            }
          />
          <Route
            path="/order/detail/:id"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              // <PrivateRoute>
              <ChatPage />
              // </PrivateRoute>
            }
          />
        </Routes>
      </Content>

      {/* 右侧侧边栏 */}
      <MailSideFloatBar />
    </Layout>
  );
}

export default App;
