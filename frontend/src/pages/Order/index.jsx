import { useState, useEffect } from "react";
import { Table, Button, Select, Card, Space, message, Popconfirm } from "antd";
import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});

export default function OrderManage() {
  const [orderList, setOrderList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    getOrderList();
  }, [pagination.current]);

  const getOrderList = async () => {
    const res = await request.get("/api/admin/order/list", {
      params: pagination,
    });
    setOrderList(res.data.list);
    setPagination({ ...pagination, total: res.data.total });
  };

  const handleDelivery = async (id) => {
    await request.put(`/api/admin/order/delivery/${id}`);
    message.success("发货成功");
    getOrderList();
  };

  const columns = [
    { title: "订单号", dataIndex: "orderNo" },
    { title: "用户", dataIndex: "username" },
    { title: "金额", dataIndex: "totalAmount", render: (t) => "¥" + t },
    {
      title: "状态",
      render: (r) => {
        const map = { 0: "待付款", 1: "待发货", 2: "已完成", 3: "已取消" };
        return map[r.status];
      },
    },
    {
      title: "操作",
      render: (r) => (
        <Space>
          {r.status === 1 && (
            <Button
              type="text"
              onClick={() => handleDelivery(r.orderId)}
            >
              发货
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="订单管理">
        <Table
          rowKey="orderId"
          columns={columns}
          dataSource={orderList}
          pagination={{
            ...pagination,
            onChange: (p) => setPagination({ ...pagination, current: p }),
          }}
        />
      </Card>
    </div>
  );
}
