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
  const [cartCount, setCartCount] = useState(0); // 购物车数量
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ==============================
  // 修复：路由变化时重新获取用户信息
  // ==============================
  useEffect(() => {
    const u = localStorage.getItem("userInfo");
    if (u) {
      setUser(JSON.parse(u));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // 路由变化就刷新

  // ==============================
  // 加：获取购物车数量
  // ==============================
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
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    setUser(null);
    setCartCount(0);
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
    // 跳转到商品列表并带搜索参数
    navigate(`/?search=${searchValue}`);
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

                {/* ============================== */}
                {/* 购物车 + 右上角数字（只改这里） */}
                {/* ============================== */}
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
        </>
      )}

      <Content className="jd-content">
        <Routes>
          <Route
            path="/"
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
