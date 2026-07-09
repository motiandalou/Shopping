import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "../theme/ThemeContext";
import MainLayout from "./layouts";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/Products/detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

// 单独抽路由+滚动逻辑组件（核心修复）
function RouterContent() {
  const location = useLocation();

  // 全局关闭浏览器滚动记忆
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // 每次切换路由强制滚到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route
          index
          element={<Home />}
        />
        <Route
          path="products"
          element={<Products />}
        />
        <Route
          path="product/:id"
          element={<ProductDetail />}
        />
        <Route
          path="cart"
          element={<Cart />}
        />
        <Route
          path="checkout"
          element={<Checkout />}
        />
        <Route
          path="about"
          element={<About />}
        />
        <Route
          path="contact"
          element={<Contact />}
        />
        <Route
          path="account"
          element={<Account />}
        />
        <Route
          path="wishlist"
          element={<Wishlist />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
      <Route
        path="login"
        element={<Login />}
      />
      <Route
        path="signup"
        element={<Signup />}
      />
      <Route
        path="chat"
        element={<Chat />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
