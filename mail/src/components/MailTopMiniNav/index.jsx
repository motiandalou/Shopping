import React, { useState, useEffect } from "react";
import "./index.less";
import { useNavigate, useLocation } from "react-router-dom";
import { getCartList } from "@/api/cart";
import { Button, Badge } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function TopMiniNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // 获取用户信息
  useEffect(() => {
    const u = localStorage.getItem("userInfo");
    if (u) {
      setUser(JSON.parse(u));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // 获取购物车数量
  useEffect(() => {
    if (user) {
      getCartList()
        .then((res) => {
          setCartCount(res.data?.length || 0);
        })
        .catch(() => {
          setCartCount(0);
        });
    } else {
      setCartCount(0);
    }
  }, [user, location.pathname]);

  return (
    <div className="top-mini-nav">
      <div className="top-nav-left">
        <span className="nav-item">中国大陆</span>
        <span className="divider">|</span>
        <span className="nav-item">{user?.userName}</span>
      </div>
      <div className="top-nav-right">
        <Badge
          count={cartCount}
          color="red"
          size="small"
        >
          <span
            className="nav-item"
            onClick={() => navigate("/cart")}
          >
            购物车
          </span>
        </Badge>

        <span className="divider">|</span>

        <span
          className="nav-item"
          onClick={() => navigate("/orders")}
        >
          我的订单
        </span>
        <span className="divider">|</span>
        <span className="nav-item">我的</span>
      </div>
    </div>
  );
}
