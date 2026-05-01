import { useState } from "react";
import { Form, Input, message, Typography, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/token";
import { loginApi } from "@/api/staff";
import ShoppingButton from "@/components/shopping_button";
import { useTranslation } from "react-i18next";
import "./index.less";

export default function Login() {
  const { t } = useTranslation();
  const imgUrl =
    "https://images.unsplash.com/photo-1773332598414-44a45e364d85?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 忘记密码弹窗
  const showForgotModal = () => {
    Modal.info({
      title: t("login.tip"),
      content: t("login.contactAdmin"),
      centered: true,
      okText: t("login.confirm"),
    });
  };

  // 登录
  const handleLogin = async (values) => {
    try {
      const res = await loginApi(values);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      message.error(t("login.fail"));
    }
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
            {t("login.welcome")}
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
            {t("login.enterDetails")}
          </Typography.Text>

          {/* Login Form */}
          <Form
            onFinish={handleLogin}
            layout="vertical"
            form={form}
          >
            <Form.Item
              name="userName"
              label={t("login.name")}
              rules={[{ required: true, message: t("login.namePlaceholder") }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                size="large"
                autoComplete="off"
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
              label={t("login.password")}
              rules={[
                { required: true, message: t("login.passwordPlaceholder") },
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
                justifyContent: "flex-end",
                alignItems: "center",
                margin: "12px 0 24px",
              }}
            >
              <Typography.Link
                style={{ fontSize: 14, color: "#000" }}
                onClick={showForgotModal}
              >
                {t("login.forgot")}
              </Typography.Link>
            </div>

            <Form.Item>
              <ShoppingButton
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
                  marginRight: 0,
                }}
              >
                {t("login.btn")}
              </ShoppingButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
