import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth";
import { setToken } from "../../utils/token";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // 调用后端登录接口
      const res = await loginApi(values);

      // 保存 token
      setToken(res.data.token);
      // 保存用户信息
      setUser({
        username: res.data.username,
        role: res.data.role,
      });

      message.success(res.msg || "登录成功");

      // 根据角色跳转
      if (res.data.role === 1) {
        // 管理员 → 后台
        navigate("/dashboard");
      } else {
        // 普通用户 → 前台下单页
        navigate("/");
      }
    } catch (err) {
      message.error(err.msg || "账号或密码错误");
    }
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
