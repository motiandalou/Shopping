import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import { getOrdersList } from "../../api/order";
import { getStateList } from "../../api/dashboard";

import {
  UserOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import ShoppingState from "../../components/Shopping_state";

export default function Dashboard() {
  // 统计数据
  const [stat, setStat] = useState({
    totalUser: 0,
    totalGoods: 0,
    totalOrder: 0,
    totalSales: 0,
  });

  // 最近订单
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 页面加载只请求一次统计
  useEffect(() => {
    fetchDashboardCount();
  }, []);

  // 分页变化时请求订单列表
  useEffect(() => {
    fetchDashboardData();
  }, [pagination.current]);

  // 获取统计数据
  const fetchDashboardCount = async () => {
    try {
      const res = await getStateList();
      setStat(res.data);
    } catch (e) {
      console.log("获取统计数据失败", e);
    }
  };

  // 获取最近订单
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      const res = await getOrdersList(params);
      // ✅ 只给订单赋值，不污染统计
      setRecentOrders(res.data || []);
    } catch (e) {
      console.log("获取订单失败", e);
    } finally {
      setLoading(false);
    }
  };

  // 表格分页切换
  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
    });
  };

  // 表格列
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
      render: (status) => (
        <ShoppingState
          status={status}
          type="order"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="数据概览">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总用户数"
              value={stat.totalUser}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总商品数"
              value={stat.totalGoods}
              prefix={<ShoppingCartOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总订单数"
              value={stat.totalOrder}
              prefix={<OrderedListOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总销售额"
              value={stat.totalSales}
              prefix={<MoneyCollectOutlined />}
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
          rowKey={() => Math.random().toString(36).slice(2)}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}
