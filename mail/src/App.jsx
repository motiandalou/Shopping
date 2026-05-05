import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

const { Header, Content, Footer } = Layout;

function App() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
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
            path="/cart"
            element={<Cart />}
          />
          <Route
            path="/order"
            element={<Order />}
          />
          <Route
            path="/orders"
            element={<OrderList />}
          />
          <Route
            path="/order/detail/:id"
            element={<OrderDetail />}
          />
          <Route
            path="/goods/detail/:id"
            element={<GoodsDetail />}
          />
          <Route
            path="/chat"
            element={<ChatPage />}
          />
        </Routes>
      </Content>

      {/* 右侧侧边栏 */}
      <MailSideFloatBar />
    </Layout>
  );
}

export default App;
