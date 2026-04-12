import React from "react";
import "./index.less";

const ShoppingState = ({ status, type = "order" }) => {
  const statusMap = {
    goods_1: { text: "已上架", color: "#52c41a" },
    goods_0: { text: "未上架", color: "#8c8c8c" },

    order_0: { text: "待付款", color: "#faad14" },
    order_1: { text: "待发货", color: "#1890ff" },
    order_2: { text: "已发货", color: "#722ed1" },
    order_3: { text: "已完成", color: "#52c41a" },
    order_4: { text: "已取消", color: "#f5222d" },

    user_1: { text: "正常", color: "#52c41a" },
    user_0: { text: "禁用", color: "#8c8c8c" },
  };

  const key = `${type}_${status}`;
  const config = statusMap[key] || { text: "未知状态", color: "#8c8c8c" };

  const { text, color } = config;
  const showPulse = color === "#52c41a";

  return (
    <span
      className="status-capsule"
      style={{ "--color": color }}
    >
      {showPulse && <span className="pulse-dot" />}
      {text}
    </span>
  );
};

export default ShoppingState;
