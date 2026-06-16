import React from "react";
import { useTranslation } from "react-i18next";
import "./index.less";

const ShoppingState = ({ status, refundStatus, type = "order" }) => {
  const { t } = useTranslation();

  // 订单类型 + 有售后状态：优先走售后
  if (type === "order" && refundStatus != null && refundStatus !== 0) {
    const refundMap = {
      1: { text: t("status.refund.pending"), color: "#ed6c02" },
      2: { text: t("status.refund.approved"), color: "#0288d1" },
      3: { text: t("status.refund.finished"), color: "#2e7d32" },
      4: { text: t("status.refund.rejected"), color: "#c62828" },
    };
    const config = refundMap[refundStatus] || {
      text: t("status.unknown"),
      color: "#616161",
    };
    const { text, color } = config;
    return (
      <span
        className="status-capsule"
        style={{ "--color": color }}
      >
        {text}
      </span>
    );
  }

  const statusMap = {
    goods_0: { text: t("status.goods.off"), color: "#616161" },
    goods_1: { text: t("status.goods.on"), color: "#2e7d32" },

    order_0: { text: t("status.order.pay"), color: "#ed6c02" },
    order_1: { text: t("status.order.delivery"), color: "#0d47a1" },
    order_2: { text: t("status.order.shipped"), color: "#4a148c" },
    order_3: { text: t("status.order.completed"), color: "#2e7d32" },
    order_4: { text: t("status.order.canceled"), color: "#c62828" },

    user_1: { text: t("status.user.normal"), color: "#2e7d32" },
    user_0: { text: t("status.user.banned"), color: "#616161" },

    log_1: { text: t("status.log.success"), color: "#2e7d32" },
    log_0: { text: t("status.log.fail"), color: "#c62828" },

    // 秒杀 flash 状态
    // 未开始
    flash_0: { text: t("status.flash.notStart"), color: "#616161" },
    // 进行中
    flash_1: { text: t("status.flash.running"), color: "#2e7d32" },
    // 已结束
    flash_2: { text: t("status.flash.ended"), color: "#c62828" },
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
