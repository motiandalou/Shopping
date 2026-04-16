import React from "react";
import { useTranslation } from "react-i18next";
import "./index.less";

const ShoppingState = ({ status, type = "order" }) => {
  const { t } = useTranslation();

  const statusMap = {
    goods_1: { text: t("status.goods.on"), color: "#52c41a" },
    goods_0: { text: t("status.goods.off"), color: "#8c8c8c" },

    order_0: { text: t("status.order.pay"), color: "#faad14" },
    order_1: { text: t("status.order.delivery"), color: "#1890ff" },
    order_2: { text: t("status.order.shipped"), color: "#722ed1" },
    order_3: { text: t("status.order.completed"), color: "#52c41a" },
    order_4: { text: t("status.order.canceled"), color: "#f5222d" },

    user_1: { text: t("status.user.normal"), color: "#52c41a" },
    user_0: { text: t("status.user.banned"), color: "#8c8c8c" },
  };

  const key = `${type}_${status}`;
  const config = statusMap[key] || {
    text: t("status.unknown"),
    color: "#8c8c8c",
  };

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
