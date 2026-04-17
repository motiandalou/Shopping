import { ConfigProvider, theme as antdTheme } from "antd";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import useTheme from "./hooks/useTheme";
import "./i18n";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";

export default function App() {
  const { i18n } = useTranslation();
  const { theme, currentTheme } = useTheme();

  const antdLocale = i18n.language === "zh" ? zhCN : enUS;

  return (
    <ConfigProvider
      key={theme}
      locale={antdLocale}
      theme={currentTheme}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
