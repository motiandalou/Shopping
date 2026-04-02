import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const target = users.find(
      (u) => u.username === values.username && u.password === values.password,
    );

    if (!target) {
      message.error("账号或密码错误");
      return;
    }

    localStorage.setItem("user", JSON.stringify(target));
    setUser(target);
    message.success("登录成功");
    navigate("/");
  };

  return (
    <Card
      title="用户登录"
      style={{ width: 400, margin: "50px auto" }}
    >
      <Form
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            登录
          </Button>
        </Form.Item>
        <Button
          type="link"
          onClick={() => navigate("/register")}
        >
          没有账号？注册
        </Button>
      </Form>
    </Card>
  );
}
