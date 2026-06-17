import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Input, Button, message } from "antd";
import "./index.less";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "@/api/user";
import { loginApi } from "@/api/auth";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import login from "@/page/assets/image/login.png";

// 登录表单类型
type LoginFormValues = {
  userName: string;
  password: string;
};

const Login: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();

  // 登录逻辑
  const handleLogin = async (values: LoginFormValues) => {
    try {
      const res = await loginApi(values);
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const { data: userInfo } = await getUserInfo();
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      navigate("/");
    } catch (err) {
      message.error("Login failed, please check your credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <Row
          gutter={48}
          align="middle"
        >
          <Col
            xs={0}
            md={12}
          >
            <div className="login-image">
              <img
                src={login}
                alt="Shopping"
              />
            </div>
          </Col>

          <Col
            xs={24}
            md={12}
          >
            <div className="login-form-wrapper">
              <h1 className="form-title">Log in to MALL</h1>
              <p className="form-subtitle">Enter your details below</p>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleLogin}
              >
                <Form.Item
                  name="userName"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your UserName",
                    },
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
                    {
                      required: true,
                      message: "Please enter your Password",
                    },
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

                <div className="form-actions">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                  >
                    Log In
                  </Button>
                  <Link
                    to="/forgot-password"
                    className="forgot-link"
                  >
                    Forget Password?
                  </Link>
                </div>
              </Form>

              <p className="signup-text">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="signup-link"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
