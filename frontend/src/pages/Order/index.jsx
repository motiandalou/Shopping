import { useState, useEffect } from "react";
import {
  Table,
  Select,
  Card,
  Space,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import {
  getOrdersList,
  updateOrders,
  deleteOrders,
  getLogistics,
} from "@/api/order";
import ShoppingButton from "@/components/shopping_button";
import ShoppingState from "../../components/Shopping_state";
import { useTranslation } from "react-i18next";

export default function OrderManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm(); // 发货表单
  const [orderList, setOrderList] = useState([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  // 物流信息相关状态
  const [logisticsVisible, setLogisticsVisible] = useState(false);
  const [logisticsList, setLogisticsList] = useState([]);

  // 打开物流弹窗
  const openLogisticsModal = async (shipperCode, logisticCode) => {
    // shipperCode:快递公司 logisticCode:快递单号
    const res = await getLogistics(shipperCode, logisticCode);
    setLogisticsList(res.data);
    setLogisticsVisible(true);
  };

  // 发货弹窗
  const [deliveryModal, setDeliveryModal] = useState({
    visible: false,
    currentOrder: null, // 当前发货订单
  });

  // 页面加载 / 页码切换 → 获取订单列表
  useEffect(() => {
    fetchOrderList();
  }, [pagination.pageNum]);

  // 获取订单列表
  const fetchOrderList = async () => {
    const res = await getOrdersList(pagination);
    setOrderList(res.data);
    setPagination({ ...pagination, total: res.data?.total || 0 });
  };

  // 打开发货弹窗
  const showDeliveryModal = (record) => {
    form.resetFields(); // 清空表单
    setDeliveryModal({
      visible: true,
      currentOrder: record,
    });
  };

  // 关闭发货弹窗
  const closeDeliveryModal = () => {
    setDeliveryModal({ visible: false, currentOrder: null });
  };

  // 确认发货（提交快递公司 + 快递单号）
  const handleConfirmDelivery = async () => {
    try {
      // 校验表单
      const values = await form.validateFields();
      const { id } = deliveryModal.currentOrder;
      const { expressCompany, expressNo } = values;

      // 传给后端：订单ID + 快递公司 + 快递单号
      const res = await updateOrders(id, {
        expressCompany,
        expressNo,
        status: 2, // 已发货状态（你后端对应的值）
      });

      message.success("发货成功");
      closeDeliveryModal();

      // 立即刷新订单列表（兼容 WS 推送前手动刷新）
      fetchOrderList();
    } catch (err) {
      message.error("发货失败，请检查表单或网络");
    }
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
      render: (payTime) => payTime || "-",
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
              onClick={() => showDeliveryModal(record)}
            >
              {t("btn.ship")}
            </ShoppingButton>
          )}
          {/* 只要已发货及以上，显示查看物流 */}
          {record.status >= 2 && (
            <ShoppingButton
              size="small"
              style={{ marginLeft: 8 }}
              onClick={() =>
                openLogisticsModal(record.shipperCode, record.logisticCode)
              }
            >
              查看物流
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

      <Modal
        title="订单发货"
        open={deliveryModal.visible}
        onCancel={closeDeliveryModal}
        onOk={handleConfirmDelivery}
        okText="确认发货"
        cancelText="取消"
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ expressCompany: "", expressNo: "" }}
        >
          {/* 订单号（只读） */}
          <Form.Item label="订单编号">
            <Input
              value={deliveryModal.currentOrder?.orderNo || ""}
              disabled
            />
          </Form.Item>

          {/* 快递公司 */}
          <Form.Item
            label="快递公司"
            name="expressCompany"
            rules={[{ required: true, message: "请选择快递公司" }]}
          >
            <Select placeholder="请选择快递公司">
              <Select.Option value="SF">顺丰速运</Select.Option>
              <Select.Option value="ZTO">中通快递</Select.Option>
              <Select.Option value="YTO">圆通快递</Select.Option>
              <Select.Option value="STO">申通快递</Select.Option>
              <Select.Option value="YD">韵达快递</Select.Option>
              <Select.Option value="JD">京东物流</Select.Option>
              <Select.Option value="YZPY">邮政快递</Select.Option>
            </Select>
          </Form.Item>

          {/* 快递单号 */}
          <Form.Item
            label="快递单号"
            name="expressNo"
            rules={[{ required: true, message: "请输入快递单号" }]}
          >
            <Input placeholder="请输入快递单号" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="物流轨迹"
        open={logisticsVisible}
        onCancel={() => setLogisticsVisible(false)}
        footer={null}
        width={920}
      >
        <div
          style={{ maxHeight: "600px", overflow: "auto", padding: "0 10px" }}
        >
          {logisticsList.length > 0 ? (
            <div style={{ position: "relative" }}>
              {/* 竖线 */}
              <div
                style={{
                  position: "absolute",
                  left: "4px",
                  top: 10,
                  bottom: 10,
                  width: 1,
                  background: "#e5e5e5",
                }}
              />

              {logisticsList.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "10px 0",
                    position: "relative",
                  }}
                >
                  {/* 圆点 */}
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      backgroundColor: index === 0 ? "#1890ff" : "#999",
                      marginRight: 16,
                      marginTop: 4,
                      zIndex: 1,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: index === 0 ? "#1890ff" : "#333",
                        fontSize: 14,
                      }}
                    >
                      {item.AcceptStation}
                    </div>
                    <div style={{ color: "#999", fontSize: 12, marginTop: 4 }}>
                      {item.AcceptTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{ textAlign: "center", padding: "30px 0", color: "#999" }}
            >
              暂无物流信息
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
