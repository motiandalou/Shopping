import { useState, useEffect } from "react";
import { Table, Select, Card, Space, message, Popconfirm } from "antd";
import { getOrdersList, updateOrders, deleteOrders } from "../../api/order";
import ShoppingButton from "../../components/shopping_button";
import ShoppingState from "../../components/Shopping_state";
import { useTranslation } from "react-i18next";

export default function OrderManage() {
  const { t } = useTranslation();
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
      title: t("order.id"),
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: t("order.user"),
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: t("order.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("order.address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("order.goods_info"),
      dataIndex: "goodsInfo",
      key: "goodsInfo",
    },
    {
      title: t("order.amount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `¥${amount}`,
    },
    {
      title: t("order.status"),
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
      title: t("order.create_time"),
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: t("order.pay_time"),
      dataIndex: "payTime",
      key: "payTime",
    },
    {
      title: t("order.operation"),
      key: "action",
      render: (record) => (
        <div>
          {record.status === 1 && (
            <ShoppingButton
              type="primary"
              size="small"
              onClick={() => handleDelivery(record.id)}
              style={{ marginRight: 0 }}
            >
              {t("btn.ship")}
            </ShoppingButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title={t("order.management")}>
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
