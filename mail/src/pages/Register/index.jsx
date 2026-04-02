import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.find((u) => u.username === values.username);

    if (exists) {
      message.error("用户名已存在");
      return;
    }

    users.push(values);
    localStorage.setItem("users", JSON.stringify(users));
    message.success("注册成功");
    navigate("/login");
  };

  return (
    <Card
      title="用户注册"
      style={{ width: 400, margin: "50px auto" }}
    >
      <Form
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "请输入手机号" }]}
        >
          <Input placeholder="手机号" />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: "请输入收货地址" }]}
        >
          <Input placeholder="收货地址" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            注册
          </Button>
        </Form.Item>
        <Button
          type="link"
          onClick={() => navigate("/login")}
        >
          已有账号？去登录
        </Button>
      </Form>
    </Card>
  );
}
