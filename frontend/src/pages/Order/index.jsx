import { useState, useEffect } from "react";
import { Table, Button, Select, Card, Space, message, Popconfirm } from "antd";
import { getOrdersList, updateOrders, deleteOrders } from "../../api/order";

export default function OrderManage() {
  const [orderList, setOrderList] = useState([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchOrderList();
  }, [pagination.pageNum]);

  const fetchOrderList = async () => {
    const res = await getOrdersList(pagination);
    setOrderList(res.data);
    setPagination({ ...pagination, total: res.data.total });
  };

  const handleDelivery = async (id) => {
    const res = await updateOrders(id);
    message.success(res.msg);
    fetchOrderList();
  };

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: "用户",
      dataIndex: "userName", // 注意：接口返回的是 userName，不是 username
      key: "userName",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "收货地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "商品信息",
      dataIndex: "goodsInfo",
      key: "goodsInfo",
    },
    {
      title: "金额",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `¥${amount}`,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
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
    {
      title: "下单时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "支付时间",
      dataIndex: "payTime",
      key: "payTime",
    },
    {
      title: "操作",
      key: "action",
      render: (record) => (
        <div>
          {record.status === 1 && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleDelivery(record.id)}
            >
              发货
            </Button>
          )}
        </div>
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
            onChange: (p) => setPagination({ ...pagination, pageNum: p }),
          }}
        />
      </Card>
    </div>
  );
}
