import React, { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Radio,
  Select,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetail, applyRefund } from "@/api/order";
import dayjs from "dayjs";

const userStr = localStorage.getItem("userInfo");
const userInfo = userStr ? JSON.parse(userStr) : {};
const userId = userInfo.id;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // 退款弹窗状态 + Form
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    const res = await getOrderDetail(id, userId);
    setOrder(res.data);
  };

  // 打开退款弹窗
  const handleRefund = (type) => {
    form.resetFields();
    form.setFieldsValue({
      refundType: type,
      refundReasonType: null,
      refundReasonOther: "",
    });
    setRefundModalVisible(true);
  };

  // 提交退款申请
  const handleRefundSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 处理退款原因：选了固定原因就用它，选了其他就用输入的内容
      let finalReason = "";
      if (values.refundReasonType === "other") {
        finalReason = values.refundReasonOther || "其他原因";
      } else {
        finalReason = values.refundReasonType;
      }

      await applyRefund({
        orderId: order.id,
        userId: userId,
        refundType: values.refundType,
        refundReason: finalReason,
      });

      message.success("申请成功");
      setRefundModalVisible(false);
      loadDetail();
    } catch (err) {
      message.error("提交失败");
    }
  };

  if (!order) return null;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <Card title="订单详情">
        <Descriptions
          bordered
          column={1}
        >
          <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
          <Descriptions.Item label="商品信息">
            {order.goodsInfo}
          </Descriptions.Item>
          <Descriptions.Item label="实付金额">
            ¥{order.totalAmount}
          </Descriptions.Item>
          <Descriptions.Item label="收货地址">
            {order.address}
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">
            {dayjs(order.createTime).format("YYYY-MM-DD HH:mm")}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Space>
            {[1, 2, 3].includes(order.status) && !order.refundStatus && (
              <>
                <Button
                  onClick={() => handleRefund(1)}
                  type="default"
                  danger
                >
                  仅退款
                </Button>
                <Button
                  onClick={() => handleRefund(2)}
                  type="primary"
                  danger
                >
                  退货退款
                </Button>
              </>
            )}
            {order.refundStatus > 0 && (
              <Button
                type="default"
                disabled
              >
                售后处理中
              </Button>
            )}
          </Space>
        </div>
      </Card>

      {/* 退款弹窗 - 京东同款 */}
      <Modal
        title="申请售后退款"
        open={refundModalVisible}
        onCancel={() => setRefundModalVisible(false)}
        onOk={handleRefundSubmit}
        centered
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {/* 退款金额（只读） */}
          <Form.Item label="退款金额">
            <div style={{ fontSize: 18, color: "#ff4d4f", fontWeight: 600 }}>
              ¥{order.totalAmount}
            </div>
          </Form.Item>

          {/* 退款类型 */}
          <Form.Item
            label="退款类型"
            name="refundType"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={1}>仅退款</Radio>
              <Radio value={2}>退货退款</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 退款原因选择（京东常见选项） */}
          <Form.Item
            label="退款原因"
            name="refundReasonType"
            rules={[{ required: true, message: "请选择退款原因" }]}
          >
            <Select placeholder="请选择退款原因">
              <Select.Option value="不想买了">不想要了/拍错了</Select.Option>
              <Select.Option value="商品质量问题">商品质量问题</Select.Option>
              <Select.Option value="发错货/漏发">发错货/漏发</Select.Option>
              <Select.Option value="商品与描述不符">
                商品与描述不符
              </Select.Option>
              <Select.Option value="物流问题">物流问题</Select.Option>
              <Select.Option value="other">其他原因</Select.Option>
            </Select>
          </Form.Item>

          {/* 其他原因输入框（只有选了“其他”才显示） */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) =>
              prev.refundReasonType !== cur.refundReasonType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("refundReasonType") === "other" ? (
                <Form.Item
                  label="其他原因"
                  name="refundReasonOther"
                  rules={[{ required: true, message: "请输入退款原因" }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="请输入退款原因"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDetail;
