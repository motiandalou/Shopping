import React from "react";
import { Card, Table } from "antd";
import "./index.less";

const ServiceTrace = () => {
  const columns = [
    { title: "日志ID", dataIndex: "id" },
    { title: "关联工单", dataIndex: "ticketNo" },
    { title: "操作人", dataIndex: "operator" },
    { title: "操作内容", dataIndex: "content" },
    { title: "操作时间", dataIndex: "operateTime" },
    { title: "IP地址", dataIndex: "ip" },
  ];

  return (
    <Card
      className="service-table-card"
      title="工单日志追溯"
    >
      <Table
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

export default ServiceTrace;
