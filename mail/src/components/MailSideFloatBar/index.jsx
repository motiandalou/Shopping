import React from "react";
import { useNavigate } from "react-router-dom";
import { FloatButton } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "./index.less";

export default function SideFloatBar() {
  const navigate = useNavigate();

  return (
    <div className="side-float-bar">
      <FloatButton.Group
        trigger="click"
        // placement="right"
        className="float-group"
      >
        {/* 购物车 */}
        <FloatButton
          icon={<ShoppingCartOutlined />}
          tooltip="购物车"
          onClick={() => navigate("/cart")}
        />
        {/* 我的 */}
        <FloatButton
          icon={<UserOutlined />}
          tooltip="我的"
          onClick={() => navigate("/orders")}
        />
        {/* 客服 */}
        <FloatButton
          icon={<MessageOutlined />}
          tooltip="客服"
          onClick={() => navigate("/chat")}
        />
      </FloatButton.Group>
    </div>
  );
}
