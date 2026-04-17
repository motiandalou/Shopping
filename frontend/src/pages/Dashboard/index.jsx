import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import { getOrdersList } from "../../api/order";
import { getStateList } from "../../api/dashboard";
import { useTranslation } from "react-i18next";
import CountUp from "../../components/Shopping_countUp";

import {
  UserOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import ShoppingState from "../../components/Shopping_state";

export default function Dashboard() {
  const { t } = useTranslation();

  const [stat, setStat] = useState({
    totalUser: 0,
    totalGoods: 0,
    totalOrder: 0,
    totalSales: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    fetchDashboardCount();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [pagination.current]);

  const fetchDashboardCount = async () => {
    try {
      const res = await getStateList();
      setStat(res.data || {});
    } catch (e) {
      console.log("获取统计失败", e);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getOrdersList({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      });
      setRecentOrders(res.data || []);
    } catch (e) {
      console.log("获取订单失败", e);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination({ ...pagination, current: newPagination.current });
  };

  const orderColumns = [
    { title: t("dashboard.order_id"), dataIndex: "orderNo" },
    { title: t("dashboard.user"), dataIndex: "userName" },
    {
      title: t("dashboard.amount"),
      dataIndex: "totalAmount",
      render: (v) => `¥${v}`,
    },
    {
      title: t("dashboard.status"),
      dataIndex: "status",
      render: (s) => <ShoppingState status={s} />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title={t("dashboard.overview")}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title={t("dashboard.total_users")}
              prefix={<UserOutlined />}
              valueRender={() => <CountUp end={stat.totalUser} />}
            />
          </Col>

          <Col span={6}>
            <Statistic
              title={t("dashboard.total_goods")}
              prefix={<ShoppingCartOutlined />}
              valueRender={() => <CountUp end={stat.totalGoods} />}
            />
          </Col>

          <Col span={6}>
            <Statistic
              title={t("dashboard.total_orders")}
              prefix={<OrderedListOutlined />}
              valueRender={() => <CountUp end={stat.totalOrder} />}
            />
          </Col>

          <Col span={6}>
            <Statistic
              title={t("dashboard.total_sales")}
              prefix={<MoneyCollectOutlined />}
              valueRender={() => (
                <CountUp
                  end={stat.totalSales}
                  prefix="¥"
                />
              )}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={t("dashboard.recent_orders")}
        style={{ marginTop: 20 }}
      >
        <Table
          columns={orderColumns}
          dataSource={recentOrders}
          rowKey="orderNo"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}
