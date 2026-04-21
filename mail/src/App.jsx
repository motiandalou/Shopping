import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Layout, Button, Dropdown, Menu, message, Input, Badge } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import OrderList from "./pages/OrderList";
import { getCartList } from "./api/cart";
import "./App.css";

const { Header, Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 判断是否是登录页
  const isLoginPage = location.pathname === "/login";

  // 获取用户信息
  useEffect(() => {
    const u = localStorage.getItem("userInfo");
    if (u) {
      setUser(JSON.parse(u));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // 获取购物车数量
  useEffect(() => {
    if (user) {
      getCartList()
        .then((res) => {
          setCartCount(res.data?.length || 0);
        })
        .catch(() => {
          setCartCount(0);
        });
    } else {
      setCartCount(0);
    }
  }, [user, location.pathname]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setCartCount(0);
    message.success("退出成功");
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

  // ==============================================
  // 登录页面 → 直接全屏渲染，不带头部底部
  // ==============================================
  if (isLoginPage) {
    return <Login setUser={setUser} />;
  }

  // ==============================================
  // 其他页面 → 带头部底部
  // ==============================================
  return (
    <Layout className="jd-layout">
      <Header className="jd-top-header">
        <div className="jd-header-container">
          <div
            className="jd-logo"
            onClick={() => navigate("/")}
          >
            <span className="jd-logo-text">Mail</span>
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

          <div className="jd-user-actions">
            {user ? (
              <Dropdown
                overlay={userMenu}
                trigger={["click"]}
              >
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  className="jd-user-btn"
                >
                  {user.userName}
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="text"
                onClick={() => navigate("/login")}
                className="jd-user-btn"
              >
                请登录
              </Button>
            )}

            <Badge
              count={cartCount}
              color="#ff3300"
              size="small"
            >
              <Button
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate("/cart")}
                className="jd-cart-btn"
              >
                购物车
              </Button>
            </Badge>

            <Button
              icon={<OrderedListOutlined />}
              onClick={() => navigate("/orders")}
              className="jd-order-btn"
            >
              订单
            </Button>
          </div>
        </div>
      </Header>

      <Content className="jd-content">
        <Routes>
          <Route
            path="/"
            element={<ProductList />}
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
        </Routes>
      </Content>

      <Footer className="jd-footer">
        <div className="jd-footer-container">
          <p>© 2026 Mail</p>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
