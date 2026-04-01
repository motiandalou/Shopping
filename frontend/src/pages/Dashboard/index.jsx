import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});

export default function Dashboard() {
  const [stat, setStat] = useState({
    userCount: 0,
    goodsCount: 0,
    orderCount: 0,
    salesCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const res = await request.get("/api/admin/dashboard");
      setStat(res.data);
      setRecentOrders(res.data.recentOrders || []);
    } catch (e) {}
  };

  const orderColumns = [
    { title: "订单号", dataIndex: "orderNo" },
    { title: "用户", dataIndex: "username" },
    { title: "金额", dataIndex: "totalAmount" },
    {
      title: "状态",
      dataIndex: "status",
      render: (s) => (s === 0 ? "待付款" : s === 1 ? "待发货" : "已完成"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="数据概览">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总用户数"
              value={stat.userCount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总商品数"
              value={stat.goodsCount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总订单数"
              value={stat.orderCount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总销售额"
              value={stat.salesCount}
              prefix="¥"
            />
          </Col>
        </Row>
      </Card>

      <Card
        title="最近订单"
        style={{ marginTop: 20 }}
      >
        <Table
          columns={orderColumns}
          dataSource={recentOrders}
          rowKey="orderId"
          pagination={false}
        />
      </Card>
    </div>
  );
}
