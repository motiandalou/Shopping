import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 注册提交
  const onFinish = async (values) => {
    try {
      const param = {
        ...values,
        id: null,
        role: 0, // 前台用户 → 必须是 0
      };

      // 调用后端接口
      const res = await registerApi(param);

      // 成功
      message.success(res.msg || "注册成功");
      navigate("/login");
    } catch (err) {
      message.error(err.msg || "注册失败");
    }
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
