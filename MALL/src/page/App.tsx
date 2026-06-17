import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
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
            {/* 404 */}
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
          />{" "}
          <Route
            path="chat"
            element={<Chat />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
