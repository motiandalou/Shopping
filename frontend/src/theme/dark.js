import { theme } from "antd";

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#00ff88", // 按钮主色：荧光绿
    colorTextBase: "#ffffff",
    colorTextSecondary: "#a0a0a0",
    colorBgBase: "#000000", // 全局背景：纯黑
    colorBgContainer: "#121212", // 卡片/表格背景：深灰黑
    colorBorder: "#333333", // 边框深灰
    colorBorderSecondary: "#222222",
    colorSuccess: "#00ff88",
    colorWarning: "#ffb74d",
    colorError: "#ff4d4f",
    colorInfo: "#40a9ff",
    borderRadius: 6,
  },
  components: {
    Button: {
      colorPrimary: "#00ff88",
      colorText: "#000000", // 按钮文字：黑色
      colorPrimaryHover: "#00e67a",
      colorPrimaryActive: "#00cc6a",
    },
    Layout: {
      colorBgHeader: "#000000",
      colorBgSider: "#000000",
      colorBgBody: "#000000",
    },
    Menu: {
      colorItemBg: "transparent",
      colorItemText: "#ffffff",
      colorItemTextSelected: "#000000",
      colorItemBgSelected: "#00ff88",
      colorItemTextHover: "#ffffff",
      colorItemBgHover: "#1a1a1a",
    },
    Card: {
      colorBgContainer: "#121212",
      colorBorder: "#333333",
    },
    Table: {
      colorBgContainer: "#121212",
      colorBgHeader: "#1a1a1a",
      colorText: "#ffffff",
      colorTextSecondary: "#a0a0a0",
      colorBorder: "#333333",
    },
    Input: {
      colorBgContainer: "#1a1a1a",
      colorBorder: "#404040",
      colorText: "#ffffff",
    },
    Sider: {
      colorBgContainer: "#000000",
    },
  },
};

export default darkTheme;
