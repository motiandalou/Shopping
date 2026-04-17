import React from "react";
import { useTranslation } from "react-i18next";
import "./index.less";

const ShoppingState = ({ status, type = "order" }) => {
  const { t } = useTranslation();

  const statusMap = {
    goods_0: { text: t("status.goods.off"), color: "#616161" },

    order_0: { text: t("status.order.pay"), color: "#ed6c02" },
    order_1: { text: t("status.order.delivery"), color: "#0d47a1" },
    order_2: { text: t("status.order.shipped"), color: "#4a148c" },
    order_3: { text: t("status.order.completed"), color: "#2e7d32" },
    order_4: { text: t("status.order.canceled"), color: "#c62828" },

    user_1: { text: t("status.user.normal"), color: "#2e7d32" },
    user_0: { text: t("status.user.banned"), color: "#616161" },
  };

  const key = `${type}_${status}`;
  const config = statusMap[key] || {
    text: t("status.unknown"),
    color: "#616161",
  };

  const { text, color } = config;
  const showPulse = color === "#2e7d32";

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
