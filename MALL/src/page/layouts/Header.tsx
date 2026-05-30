import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { Input, Badge, Dropdown, Select, Space, message } from "antd";
import type { MenuProps } from "antd";
import { logoutApi } from "@/api/auth";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  BulbOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/ThemeContext";
import "./Header.less";
import { getCartList } from "@/api/cart";
import { getFavoriteList } from "@/api/favorite";

const { Search } = Input;

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [FavoriteCount, setFavoriteCount] = useState(0);
  const refreshToken = localStorage.getItem("refreshToken");

  // 购物车数量
  const fetchRealCart = async () => {
    try {
      // TODO 任何页面都要变化
      const res = await getCartList();
      if (res.success) {
        setCartCount(res.data.length);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 心愿数量
  const fetchRealFavorite = async () => {
    try {
      // TODO 任何页面都要变化
      const res = await getFavoriteList();
      if (res.success) {
        setFavoriteCount(res.data.length);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRealCart();
    fetchRealFavorite();
  });

  // 退出登录请求
  const handleLogout = async () => {
    try {
      const res = await logoutApi();
      if (res.success) {
        // 清空本地缓存
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // 跳转登录页面
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/products?search=${value}`);
    }
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "account",
      label: <Link to="/account">{t("nav.account")}</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <ShoppingOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="container">
          <div className="top-header-content">
            <div className="flex-spacer" />
            <div className="promo-text">
              {t("header.summer_sale")}{" "}
              <Link
                to="/products"
                className="shop-now-link"
              >
                {t("header.shop_now")}
              </Link>
            </div>
            <div className="top-header-right">
              <Select
                value={i18n.language}
                onChange={handleLanguageChange}
                size="small"
                variant="borderless"
                className="language-select"
                options={[
                  { value: "en", label: "English" },
                  { value: "zh", label: "中文" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link
              to="/"
              className="logo"
            >
              MALL
            </Link>

            {/* Navigation */}
            <nav className="nav-menu">
              <NavLink
                end
                to="/"
                className={location.pathname === "/" ? "active-nav" : ""}
              >
                {t("nav.home")}
              </NavLink>
              <NavLink
                to="/contact"
                className={location.pathname === "/contact" ? "active-nav" : ""}
              >
                {t("nav.contact")}
              </NavLink>
              <NavLink
                to="/about"
                className={location.pathname === "/about" ? "active-nav" : ""}
              >
                {t("nav.about")}
              </NavLink>
              {!refreshToken && (
                <NavLink
                  to="/signup"
                  className={
                    location.pathname === "/signup" ? "active-nav" : ""
                  }
                >
                  {t("nav.signup")}
                </NavLink>
              )}
            </nav>

            {/* Actions */}
            <Space
              size="large"
              className="header-actions"
            >
              <Search
                placeholder={t("header.search_placeholder")}
                onSearch={handleSearch}
                style={{ width: 240 }}
                allowClear
              />

              <Link to="/wishlist">
                <Badge
                  count={FavoriteCount}
                  size="small"
                >
                  <HeartOutlined className="header-icon" />
                </Badge>
              </Link>

              <Link to="/cart">
                <Badge
                  count={cartCount}
                  size="small"
                >
                  <ShoppingCartOutlined className="header-icon" />
                </Badge>
              </Link>

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
              >
                <UserOutlined className="header-icon" />
              </Dropdown>

              <BulbOutlined
                className="header-icon"
                onClick={toggleTheme}
              />
            </Space>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
