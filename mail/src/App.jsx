import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Layout, Button, Dropdown, Menu, message, Input } from "antd";
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
import "./App.css";

const { Header, Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    message.success("退出成功");
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => navigate("/orders")}>我的订单</Menu.Item>
      <Menu.Item onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  const noHeaderPages = ["/login"];
  const showHeader = !noHeaderPages.includes(location.pathname);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    message.info(`搜索：${searchValue}`);
  };

  return (
    <Layout className="jd-layout">
      {showHeader && (
        <>
          {/* 京东顶部导航栏 */}
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
                      {user.username}
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
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate("/cart")}
                  className="jd-cart-btn"
                >
                  购物车
                </Button>
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

          {/* 京东分类导航栏 */}
          <nav className="jd-category-nav">
            <div className="jd-nav-container">
              <ul>
                <li>
                  <a href="#">首页</a>
                </li>
                <li>
                  <a href="#">手机数码</a>
                </li>
                <li>
                  <a href="#">美妆个护</a>
                </li>
                <li>
                  <a href="#">家用电器</a>
                </li>
                <li>
                  <a href="#">服饰鞋包</a>
                </li>
                <li>
                  <a href="#">食品生鲜</a>
                </li>
                <li>
                  <a href="#">家居日用</a>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}

      <Content className="jd-content">
        <Routes>
          <Route
            path="/productList"
            element={<ProductList />}
          />
          <Route
            path="/login"
            element={<Login setUser={setUser} />}
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
