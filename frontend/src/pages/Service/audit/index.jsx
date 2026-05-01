import React from "react";
import { Card, Table, Button, Space } from "antd";
import "./index.less";

const ServiceAudit = () => {
  const columns = [
    { title: "审核ID", dataIndex: "id" },
    { title: "关联订单", dataIndex: "orderNo" },
    { title: "申请原因", dataIndex: "reason" },
    { title: "申请时间", dataIndex: "time" },
    { title: "审核状态", dataIndex: "auditStatus" },
    {
      title: "操作",
      render: () => (
        <Space>
          <Button type="link">审核通过</Button>
          <Button
            type="link"
            danger
          >
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="service-table-card"
      title="售后审核处理"
    >
      <Table
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

export default ServiceAudit;
