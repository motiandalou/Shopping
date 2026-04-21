import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  message,
  Space,
  Badge,
  Drawer,
  List,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  ShopOutlined,
  OrderedListOutlined,
  UserOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  SkinOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";
import ShoppingButton from "../components/shopping_button";
import { getStaffInfo } from "../api/staff";
import "./index.less";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import websocket from "@/utils/websocket";

const { Sider, Content, Header } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [userInfo, setUserInfo] = useState(null);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [orderNoticeList, setOrderNoticeList] = useState([]);

  useEffect(() => {
    websocket.connect();

    const handleMessage = (data) => {
      if (data.type === "NEW_ORDER") {
        const order = data.order;

        const newNotice = {
          id: Date.now(),
          type: "NEW_ORDER",
          order: order,
          content: `新订单 #${order.orderNo}`,
          time: "刚刚",
        };

        setOrderNoticeList((prev) => [newNotice, ...prev]);
        setUnreadOrderCount((prev) => prev + 1);
      }
    };

    websocket.onMessage(handleMessage);

    return () => {};
  }, []);

  // 点击通知项跳转
  const handleNoticeClick = (item) => {
    if (item.type === "NEW_ORDER") {
      setNoticeOpen(false);
      navigate("/order");
    }
  };

  const showNoticeDrawer = () => {
    setNoticeOpen(true);
    setUnreadOrderCount(0);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && ["zh", "en"].includes(savedLang)) {
      i18n.changeLanguage(savedLang);
    } else {
      i18n.changeLanguage("en");
    }
  }, [i18n]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getStaffInfo();
        setUserInfo(res.data);
      } catch (err) {
        console.log("获取用户信息失败:", err);
      }
    };
    fetchUserInfo();
  }, []);

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
  ].filter(Boolean);

  const toggleLang = () => {
    const nextLang = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const getRoleText = () => {
    if (!userInfo) return "";
    return userInfo.role === 0 ? "Admin" : "Staff";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme={theme}
      >
        <div
          style={{
            height: 64,
            lineHeight: "64px",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: theme === "dark" ? "#fff" : "#000",
          }}
        >
          {!collapsed ? "Shop Admin" : "Shop"}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme={theme}
          style={{ height: "calc(100% - 120px)", borderRight: 0 }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Menu
            theme={theme}
            mode="inline"
            selectedKeys={[]}
            items={[
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: t("Log out"),
                onClick: handleLogout,
              },
            ]}
          />
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: theme === "dark" ? "#141414" : "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ShoppingButton
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: theme === "dark" ? "#fff" : "#000" }}
          />

          <Space
            size={4}
            align="center"
          >
            <ShoppingButton
              type="text"
              style={{ color: theme === "dark" ? "#fff" : "#000" }}
              onClick={showNoticeDrawer}
            >
              <Badge
                count={unreadOrderCount}
                offset={[5, -5]}
                color="#ff4d4f"
              >
                <BellOutlined style={{ fontSize: 18 }} />
              </Badge>
            </ShoppingButton>

            <ShoppingButton
              type="text"
              icon={<GlobalOutlined style={{ fontSize: 18 }} />}
              onClick={toggleLang}
              style={{ color: theme === "dark" ? "#fff" : "#000" }}
            />

            <ShoppingButton
              type="text"
              icon={<SkinOutlined style={{ fontSize: 18 }} />}
              onClick={toggleTheme}
              style={{ color: theme === "dark" ? "#fff" : "#000" }}
            />

            <Space
              size="small"
              align="center"
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ borderRadius: 5 }}
              />
              <div
                style={{
                  maxWidth: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: 40,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: theme === "dark" ? "#fff" : "#000",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.2",
                  }}
                >
                  {userInfo?.realName || userInfo?.userName || "User"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: "1.2",
                    marginTop: 5,
                  }}
                >
                  {getRoleText()}
                </div>
              </div>
            </Space>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: theme === "dark" ? "#141414" : "#fff",
            borderRadius: 6,
            height: "calc(100vh - 112px)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        title="消息通知"
        placement="right"
        width={380}
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        closable={false}
        styles={{
          header: { padding: "16px 20px", borderBottom: "1px solid #f0f0f0" },
          body: { padding: "12px 16px" },
        }}
      >
        {orderNoticeList.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#999" }}
          >
            暂无通知消息
          </div>
        ) : (
          <List
            dataSource={orderNoticeList}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => handleNoticeClick(item)}
                style={{
                  marginBottom: 8,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "#f9f9f9",
                  border: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: "#e6f7ff",
                      color: "#1890ff",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    📦
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography.Text strong>{item.content}</Typography.Text>
                    <br />
                    <Typography.Text style={{ fontSize: 12, color: "#666" }}>
                      {item.order.goodsInfo} | ￥{item.order.totalAmount}
                    </Typography.Text>
                    <br />
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12 }}
                    >
                      {item.time}
                    </Typography.Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </Layout>
  );
}
