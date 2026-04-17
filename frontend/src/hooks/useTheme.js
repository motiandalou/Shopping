import { useEffect, useState } from "react";
import lightTheme from "../theme/light";
import darkTheme from "../theme/dark";

export default function useTheme() {
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || getSystemTheme(),
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // window.location.reload(); // 强制页面刷新
  };

  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const isDark = theme === "dark";

  return { theme, toggleTheme, currentTheme, isDark };
}
