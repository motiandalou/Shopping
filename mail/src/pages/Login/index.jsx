import { useState } from "react";
import { Form, Input, Button, message, Checkbox, Typography } from "antd";
import {
  GoogleCircleFilled,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/token";
import { loginApi, registerApi } from "../../api/user";

export default function Login() {
  const imgUrl =
    "https://images.unsplash.com/photo-1773332598414-44a45e364d85?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [remember, setRemember] = useState(true);

  const [form] = Form.useForm();

  // 登录
  const handleLogin = async (values) => {
    try {
      const res = await loginApi(values);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      message.error("Login failed, please check your credentials");
    }
  };

  // 注册
  const handleRegister = async (values) => {
    try {
      const param = {
        ...values,
        role: 0, // 普通用户
        age: 18,
      };
      const res = await registerApi(param);
      message.success(res.msg);
      setIsLogin(true);
      form.resetFields(); // 注册成功也清空
    } catch (err) {
      message.error("Registration failed: " + (err.message || "Unknown error"));
    }
  };

  // 切换到注册，并清空表单
  const goToRegister = () => {
    setIsLogin(false);
    form.resetFields();
  };

  // 切换到登录，并清空表单
  const goToLogin = () => {
    setIsLogin(true);
    form.resetFields();
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Left Image */}
      <div
        style={{
          width: "50%",
          background: "#e9e9e9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={imgUrl}
          alt="login illustration"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Right Form */}
      <div
        style={{
          width: "50%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Title */}
          <Typography.Title
            level={2}
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              textAlign: "left",
            }}
          >
            {isLogin ? "WELCOME" : "REGISTER"}
          </Typography.Title>

          <Typography.Text
            style={{
              fontSize: 16,
              color: "#888",
              display: "block",
              marginBottom: 32,
              textAlign: "left",
            }}
          >
            {isLogin
              ? "Please enter your details"
              : "Please fill in the information"}
          </Typography.Text>

          {/* Login Form */}
          {isLogin ? (
            <Form
              onFinish={handleLogin}
              layout="vertical"
              form={form}
            >
              <Form.Item
                name="userName"
                label="Username"
                rules={[
                  { required: true, message: "Please enter your userName" },
                ]}
                style={{ marginBottom: 4 }}
              >
                <Input
                  size="large"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #e8e8e8",
                    borderRadius: 0,
                    padding: "12px 0",
                    fontSize: 16,
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
                style={{ marginBottom: 4 }}
              >
                <Input.Password
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{
                    border: "none",
                    borderBottom: "1px solid #e8e8e8",
                    borderRadius: 0,
                    padding: "12px 0",
                    fontSize: 16,
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "12px 0 24px",
                }}
              >
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <Typography.Link style={{ fontSize: 14 }}>
                  Forgot password?
                </Typography.Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  style={{
                    height: 48,
                    borderRadius: 24,
                    background: "#1a1a2e",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
              </Form.Item>

              {/* Register Link */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: 30,
                  fontSize: 14,
                  color: "#666",
                }}
              >
                Don't have an account?
                <Typography.Link
                  onClick={goToRegister}
                  style={{ fontWeight: 600, marginLeft: 4 }}
                >
                  Register now
                </Typography.Link>
              </div>
            </Form>
          ) : (
            // Register Form
            <Form
              onFinish={handleRegister}
              layout="vertical"
              form={form}
            >
              <Form.Item
                name="userName"
                label="Username"
                rules={[
                  { required: true, message: "Please enter your Username" },
                ]}
                style={{ marginBottom: 4 }}
              >
                <Input
                  size="large"
                  style={{
                    border: "none",
                    borderBottom: "1px solid #e8e8e8",
                    borderRadius: 0,
                    padding: "12px 0",
                    fontSize: 16,
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please set your password" },
                ]}
                style={{ marginBottom: 4 }}
              >
                <Input.Password
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{
                    border: "none",
                    borderBottom: "1px solid #e8e8e8",
                    borderRadius: 0,
                    padding: "12px 0",
                    fontSize: 16,
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 12 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  style={{
                    height: 48,
                    borderRadius: 24,
                    background: "#1a1a2e",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Register
                </Button>
              </Form.Item>

              {/* Login Link */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: 30,
                  fontSize: 14,
                  color: "#666",
                }}
              >
                Already have an account?
                <Typography.Link
                  onClick={goToLogin}
                  style={{ fontWeight: 600, marginLeft: 4 }}
                >
                  Login now
                </Typography.Link>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
