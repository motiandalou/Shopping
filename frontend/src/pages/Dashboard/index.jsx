import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import { getOrdersList } from "../../api/order";

import {
  UserOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  const [stat, setStat] = useState({
    userCount: 0,
    goodsCount: 0,
    orderCount: 0,
    salesCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [pagination.pageNum]);

  // 获取统计数据
  const fetchDashboardCount = async () => {
    try {
      const res = await getOrdersList();
      setStat(res.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  // 获取最近订单
  const fetchDashboardData = async () => {
    try {
      const res = await getOrdersList(pagination);
      setStat(res.data);
      setRecentOrders(res.data || []);
    } catch (e) {
      console.log("error", e);
    }
  };

  const orderColumns = [
    { title: "订单号", dataIndex: "orderNo" },
    { title: "用户", dataIndex: "userName" },
    {
      title: "金额",
      dataIndex: "totalAmount",
      render: (amount) => `¥${amount}`,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status) => {
        const statusMap = {
          0: "待付款",
          1: "待发货",
          2: "已发货",
          3: "已完成",
          4: "已取消",
        };
        return statusMap[status] || "未知状态";
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* <div style={{ fontSize: 32 }}>
        <MotionNumber
          value={9597000}
          format={{
            style: "decimal",
            minimumFractionDigits: 0,
            useGrouping: true,
          }}
          locales="zh-CN"
          transition={{ duration: 2 }}
        />
        km²
      </div> */}
      <Card title="数据概览">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总用户数"
              value={stat.userCount}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总商品数"
              value={stat.goodsCount}
              prefix={<ShoppingCartOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总订单数"
              value={stat.orderCount}
              prefix={<OrderedListOutlined prefix={<MoneyCollectOutlined />} />}
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
        />
      </Card>
    </div>
  );
}
