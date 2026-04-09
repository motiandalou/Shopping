import { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Button, message } from "antd";
import {
  BarChartOutlined,
  ShopOutlined,
  OrderedListOutlined,
  UserOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  SkinOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";

const { Sider, Content, Header } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();

  // 菜单
  const menuItems = [
    {
      key: "/",
      icon: <BarChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/goods",
      icon: <ShopOutlined />,
      label: <Link to="/goods">商品管理</Link>,
    },
    {
      key: "/order",
      icon: <OrderedListOutlined />,
      label: <Link to="/order">订单管理</Link>,
    },
    {
      key: "/user",
      icon: <UserOutlined />,
      label: <Link to="/user">用户管理</Link>,
    },
    {
      key: "/category",
      icon: <AppstoreOutlined />,
      label: <Link to="/category">分类管理</Link>,
    },
  ];

  // 右上角下拉菜单
  const userMenuItems = [
    {
      key: "lang",
      icon: <GlobalOutlined />,
      label: "语言",
      children: [
        { key: "zh", label: "中文" },
        { key: "en", label: "English" },
        { key: "tw", label: "繁體" },
      ],
    },
    {
      key: "theme",
      icon: <SkinOutlined />,
      label: theme === "light" ? "切换深色主题" : "切换浅色主题",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  // 下拉菜单点击事件
  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      removeToken();
      message.success("退出成功");
      navigate("/login");
    } else if (key === "theme") {
      setTheme(theme === "light" ? "dark" : "light");
      message.success(`已切换至${theme === "light" ? "深色" : "浅色"}模式`);
    } else if (["zh", "en", "tw"].includes(key)) {
      const map = { zh: "中文", en: "English", tw: "繁體" };
      message.success(`语言已切换至：${map[key]}`);
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
        style={{ background: "#001529" }}
      >
        <div
          style={{
            height: 64,
            lineHeight: "64px",
            textAlign: "center",
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {!collapsed && "管理后台"}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            height: "calc(100% - 64px)",
            borderRight: 0,
            background: "transparent",
          }}
          // 去掉点击白色
          styles={{
            item: {
              color: "rgba(255,255,255,0.7)",
              "--ant-menu-item-color": "rgba(255,255,255,0.7)",
              "--ant-menu-item-selected-bg": "#000c17",
              "--ant-menu-item-selected-color": "#FFF",
              "--ant-menu-item-hover-bg": "#001529",
              "--ant-menu-item-hover-color": "#FFF",
              outline: "none",
              border: "none",
            },
          }}
        />
      </Sider>

      {/* 右侧整体 */}
      <Layout>
        {/* 顶部导航栏 */}
        <Header
          style={{
            padding: "0 20px",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <Button
              type="text"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
              />
            </Button>
          </Dropdown>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: 6,
            minHeight: "calc(100vh - 112px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
