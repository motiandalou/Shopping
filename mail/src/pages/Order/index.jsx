import React, { useState, useEffect } from "react";
import { Card, Button, List, message, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { getCartList } from "../../api/cart";
import { addOrder } from "../../api/order";
import { clearCart } from "../../api/cart";

export default function Order() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // 新增：存储用户信息
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 获取用户信息 + 购物车
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("userInfo"));
    if (!u) {
      message.error("请先登录");
      navigate("/login");
      return;
    }
    setUser(u);
    form.setFieldsValue({
      address: u.address || "",
      phone: u.phone || "",
    });
    fetchRealCart();
  }, []);

  const fetchRealCart = async () => {
    try {
      const res = await getCartList();
      if (res.code === 200) {
        setCart(res.data);
        if (res.data.length === 0) {
          message.warning("购物车为空");
          navigate("/cart");
        }
      }
    } catch (err) {
      message.error("获取购物车失败");
    }
  };

  // 计算总价 + 拼接商品信息（和数据库 goods_info 对应）
  const total = cart.reduce((s, item) => s + item.price * item.quantity, 0);
  const goodsInfo = cart
    .map((item) => `${item.goodsName} × ${item.quantity}`)
    .join("；");

  const submit = async () => {
    const address = form.getFieldValue("address");
    const phone = form.getFieldValue("phone");
    if (!address || !phone) {
      message.error("请填写完整收货信息");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        phone: phone,
        address: address,
        goodsInfo: goodsInfo,
        totalAmount: total,
        orderNo: "ORDER" + Date.now(),
        status: 1, // 已支付
      };

      const res = await addOrder(orderData);
      if (res.code === 200) {
        message.success("下单成功！");
        // 下单成功后清空购物车
        await clearCart();
        navigate("/orders");
      }
    } catch (err) {
      message.error("下单失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="确认订单"
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="phone"
          label="联系电话"
          rules={[{ required: true, message: "请输入联系电话" }]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item
          name="address"
          label="收货地址"
          rules={[{ required: true, message: "请输入收货地址" }]}
        >
          <Input.TextArea
            rows={2}
            placeholder="请输入详细收货地址"
          />
        </Form.Item>
      </Form>

      <List
        dataSource={cart}
        renderItem={(item) => (
          <List.Item>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={item.coverImg}
                style={{ width: 40, height: 40, objectFit: "cover" }}
              />
              <span>{item.goodsName}</span>
            </div>
            <div>
              ¥{item.price} × {item.quantity} ={" "}
              <strong>¥{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          </List.Item>
        )}
      />

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <h2>实付：¥{total.toFixed(2)}</h2>
        <Button
          type="primary"
          size="large"
          onClick={submit}
          loading={loading}
        >
          付款
        </Button>
      </div>
    </Card>
  );
}
