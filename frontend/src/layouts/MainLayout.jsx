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

const { Sider, Content, Header } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

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

  // 菜单
  const menuItems = [
    {
      key: "/dashboard",
      icon: <BarChartOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
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
      label: <Link to="/user">客户管理</Link>,
    },
    {
      key: "/category",
      icon: <AppstoreOutlined />,
      label: <Link to="/category">分类管理</Link>,
    },
    userInfo?.role === 0 && {
      key: "/staff",
      icon: <TeamOutlined />,
      label: <Link to="/staff">员工管理</Link>,
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
        // style={{ background: "#001529" }}
        theme="light"
        style={{ background: "#fff" }}
      >
        <div
          style={{
            height: 64,
            lineHeight: "64px",
            textAlign: "center",
            // color: "#fff",
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
          theme="light"
          style={{
            height: "calc(100% - 64px)",
            borderRight: 0,
            // background: "transparent",
            background: "#fff",
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
            <ShoppingButton
              type="text"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginRight: 0,
              }}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
              />
            </ShoppingButton>
          </Dropdown>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: 6,
            height: "calc(100vh - 112px)",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
