import { useState, useEffect } from "react";
import { Table, Select, Card, Space, message, Popconfirm } from "antd";
import { getOrdersList, updateOrders, deleteOrders } from "../../api/order";
import ShoppingButton from "../../components/shopping_button";
import ShoppingState from "../../components/Shopping_state";

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
      dataIndex: "userName",
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
      render: (status) => (
        <ShoppingState
          status={status}
          type="order"
        />
      ),
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
            // 👇 只改了这里！
            <ShoppingButton
              type="primary"
              size="small"
              onClick={() => handleDelivery(record.id)}
              style={{ marginRight: 0 }} // 去掉多余间距
            >
              发货
            </ShoppingButton>
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
