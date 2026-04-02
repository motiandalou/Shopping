import React, { useState, useEffect } from "react";
import { Card, Button, List, message, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!u) {
      navigate("/login");
      return;
    }
    if (c.length === 0) {
      navigate("/cart");
      return;
    }
    setUser(u);
    setCart(c);
    form.setFieldsValue({ address: u.address });
  }, [navigate, form]);

  const total = cart.reduce((s, i) => s + i.price * i.num, 0);

  const submit = () => {
    const order = {
      id: Date.now(),
      items: cart,
      total,
      address: form.getFieldValue("address"),
      user: user.username,
      time: new Date().toLocaleString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("cart", "[]");
    message.success("下单成功");
    navigate("/orders");
  };

  return (
    <Card title="确认订单">
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="address"
          label="收货地址"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>

      <List
        dataSource={cart}
        renderItem={(i) => (
          <List.Item>
            {i.name} × {i.num} = ¥{i.price * i.num}
          </List.Item>
        )}
      />

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <h2>实付：¥{total}</h2>
        <Button
          type="primary"
          size="large"
          onClick={submit}
        >
          提交订单
        </Button>
      </div>
    </Card>
  );
}
