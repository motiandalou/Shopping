import { theme } from "antd";

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#000000", // 按钮主色：纯黑
    colorTextBase: "#000000",
    colorTextSecondary: "#666666",
    colorBgBase: "#ffffff", // 全局背景：纯白
    colorBgContainer: "#ffffff", // 卡片/表格背景：纯白
    colorBorder: "#e8e8e8", // 边框浅灰
    colorBorderSecondary: "#f0f0f0",
    colorSuccess: "#00b42a",
    colorWarning: "#ff7d00",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    borderRadius: 6,
  },
  components: {
    Button: {
      colorPrimary: "#000000",
      colorText: "#000000", // 按钮文字：白色
      colorPrimaryHover: "#333333", // hover 深灰
      colorPrimaryActive: "#555555",
    },
    Layout: {
      headerBg: "#ffffff",
      colorBgSider: "#ffffff",
      bodyBg: "#F9FAFB",
    },
    Menu: {
      itemBg: "transparent",
      itemColor: "#000000",
      itemSelectedColor: "#ffffff",
      itemSelectedBg: "#000000",
      itemHoverColor: "#000000",
      itemHoverBg: "#f5f5f5",
    },
    Card: {
      colorBgContainer: "#ffffff",
      colorBorder: "#e8e8e8",
    },
    Table: {
      colorBgContainer: "#ffffff",
      headerBg: "#fafafa",
      colorText: "#000000",
      colorTextSecondary: "#666666",
      colorBorder: "#e8e8e8",
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorBorder: "#d9d9d9",
      colorText: "#000000",
    },
    Sider: {
      colorBgContainer: "#ffffff",
    },
  },
};

export default lightTheme;
