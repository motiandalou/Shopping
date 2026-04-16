import { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
  BarChartOutlined,
  ShopOutlined,
  OrderedListOutlined,
  UserOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  SkinOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";
import ShoppingButton from "../components/shopping_button";
import { getStaffInfo } from "../api/staff";
import "./index.less";

import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

const { Sider, Content, Header } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [userInfo, setUserInfo] = useState(null);

  // ✅ 关键：初始化语言，优先读取本地存储的语言设置
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && ["zh", "en"].includes(savedLang)) {
      i18n.changeLanguage(savedLang);
    } else {
      // 没有设置过语言，默认英文
      i18n.changeLanguage("en");
    }
  }, [i18n]);

  // 获取当前登录人信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getStaffInfo();
        setUserInfo(res.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
      } catch (err) {
        console.log("获取用户信息失败:", err);
      }
    };
    fetchUserInfo();
  }, []);

  // ✅ 菜单（国际化）
  const menuItems = [
    {
      key: "/dashboard",
      icon: <BarChartOutlined />,
      label: <Link to="/dashboard">{t("menu.dashboard")}</Link>,
    },
    {
      key: "/goods",
      icon: <ShopOutlined />,
      label: <Link to="/goods">{t("menu.goods")}</Link>,
    },
    {
      key: "/order",
      icon: <OrderedListOutlined />,
      label: <Link to="/order">{t("menu.order")}</Link>,
    },
    {
      key: "/user",
      icon: <UserOutlined />,
      label: <Link to="/user">{t("menu.user")}</Link>,
    },
    {
      key: "/category",
      icon: <AppstoreOutlined />,
      label: <Link to="/category">{t("menu.category")}</Link>,
    },
    userInfo?.role === 0 && {
      key: "/staff",
      icon: <TeamOutlined />,
      label: <Link to="/staff">{t("menu.staff")}</Link>,
    },
  ].filter(Boolean); // 防止 false

  // ✅ 右上角菜单（国际化）
  const userMenuItems = [
    {
      key: "lang",
      icon: <GlobalOutlined />,
      label: t("language"),
      children: [
        { key: "zh", label: "中文" },
        { key: "en", label: "English" },
      ],
    },
    {
      key: "theme",
      icon: <SkinOutlined />,
      label:
        theme === "light"
          ? t("theme_dark") || "切换深色"
          : t("theme_light") || "切换浅色",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("logout"),
    },
  ];

  // ✅ 点击事件（真正切换）
  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      removeToken();
      message.success(t("logout") + "成功");
      navigate("/login");
    }

    // ✅ 切换主题（全局）
    else if (key === "theme") {
      toggleTheme();
      message.success(theme === "light" ? "已切换深色模式" : "已切换浅色模式");
    }

    // ✅ 切换语言（真正生效）
    else if (["zh", "en"].includes(key)) {
      i18n.changeLanguage(key);
      localStorage.setItem("lang", key);
      message.success(key === "zh" ? "切换中文成功" : "Switched to English");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边栏 */}
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme={theme} // ✅ 跟随主题
      >
        <div
          style={{
            height: 64,
            lineHeight: "64px",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {!collapsed && "Shop Admin"}
          {collapsed && "Shop"}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme={theme} // ✅ 跟随主题
          style={{
            height: "calc(100% - 64px)",
            borderRight: 0,
          }}
        />
      </Sider>

      {/* 右侧 */}
      <Layout>
        {/* 顶部 */}
        <Header
          style={{
            padding: "0 20px",
            background: theme === "dark" ? "#141414" : "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <ShoppingButton
              type="text"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
              />
            </ShoppingButton>
          </Dropdown>
        </Header>

        {/* 内容 */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: theme === "dark" ? "#141414" : "#fff",
            borderRadius: 6,
            height: "calc(100vh - 112px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
