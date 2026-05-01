import React from "react";
import { Card, Table } from "antd";
import "./index.less";

const ServiceRefund = () => {
  const columns = [
    { title: "退款单号", dataIndex: "refundNo" },
    { title: "关联订单", dataIndex: "orderNo" },
    { title: "退款金额", dataIndex: "amount" },
    { title: "退款类型", dataIndex: "refundType" },
    { title: "退款状态", dataIndex: "status" },
    { title: "完成时间", dataIndex: "finishTime" },
  ];

  return (
    <Card
      className="service-table-card"
      title="退款记录"
    >
      <Table
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

export default ServiceRefund;
