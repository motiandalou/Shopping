import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Radio,
  Button,
  Breadcrumb,
  Space,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { getUserInfo } from "@/api/user";
import { addOrder } from "@/api/order";
import { getCartList } from "@/api/cart";

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);
  const goodsInfo = cart
    .map((item) => `${item.goodsName} × ${item.quantity}`)
    .join("；");

  const fetchRealCart = async () => {
    try {
      const res = await getCartList();
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserInfo = async () => {
    const res = await getUserInfo();
    const data = res.data;
    form.setFieldsValue({
      name: data.userName,
      phone: data.phone,
      address: data.address,
    });
  };

  useEffect(() => {
    fetchUserInfo();
    fetchRealCart();
  }, [form]);

  // 提交订单请求后端
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const param = {
        // TODO 银行卡的要优化
        // paymentMethod,
        phone: values.phone,
        address: values.address,
        goodsInfo: goodsInfo,
        totalAmount: total,
        orderNo: "ORDER" + Date.now(),
        status: 1, // 已支付
      };

      const res = await addOrder(param);
      if (res.success) {
        message.success(res.msg);
        // 下单成功跳转订单页/支付页
        navigate("/");
      } else {
        message.success(res.msg);
      }
    } catch (err) {
      message.error(res.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">{t("nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/cart">{t("nav.cart")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Checkout</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="page-title">{t("checkout.billing_details")}</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={48}>
            <Col
              xs={24}
              lg={14}
            >
              <Form.Item
                label={t("checkout.name")}
                name="name"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={t("checkout.street_address")}
                name="address"
                rules={[{ required: true }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={t("checkout.apartment")}
                name="apartment"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={t("checkout.town_city")}
                name="townCity"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={t("checkout.phone_number")}
                name="phone"
                rules={[{ required: true }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              lg={10}
            >
              <div className="order-summary">
                <div className="order-items">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="order-item"
                    >
                      <Space>
                        <img
                          src={item.coverImg}
                          alt={item.goodsName}
                        />
                        <span>{item.goodsName}</span>
                      </Space>
                      <span className="item-price">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-row">
                  <span>{t("cart.subtotal")}:</span>
                  <span>${total}</span>
                </div>

                <div className="summary-row">
                  <span>{t("cart.shipping")}:</span>
                  <span className="free">{t("cart.free_shipping")}</span>
                </div>

                <div className="summary-row total">
                  <span>{t("cart.total")}:</span>
                  <span>${total}</span>
                </div>

                <div className="payment-methods">
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                    >
                      <Radio value="bank">{t("checkout.bank")}</Radio>
                      <Radio value="cash">
                        {t("checkout.cash_on_delivery")}
                      </Radio>
                    </Space>
                  </Radio.Group>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
                >
                  {t("checkout.place_order")}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Checkout;
