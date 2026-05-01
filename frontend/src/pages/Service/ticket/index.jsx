import React from "react";
import { Card, Table, Input, Button, Space } from "antd";
import "./index.less";

const ServiceTicket = () => {
  const columns = [
    { title: "工单编号", dataIndex: "orderNo" },
    { title: "用户信息", dataIndex: "userInfo" },
    { title: "工单类型", dataIndex: "type" },
    { title: "状态", dataIndex: "status" },
    { title: "创建时间", dataIndex: "createTime" },
    {
      title: "操作",
      render: () => (
        <Space>
          <Button type="link">查看</Button>
          <Button type="link">处理</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="service-table-card"
      title="售后工单列表"
    >
      <div className="search-bar">
        <Input
          placeholder="请输入工单编号"
          style={{ width: 240 }}
        />
        <Button type="primary">搜索</Button>
      </div>
      <Table
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

export default ServiceTicket;
