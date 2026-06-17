import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Input, Button, message } from "antd";
import "./index.less";
import { useNavigate } from "react-router-dom";
import { registerApi } from "@/api/auth";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import login from "@/page/assets/image/login.png";

// 登录表单类型
type registerFormValues = {
  userName: string;
  password: string;
};

// 注册
const Signup: React.FC = () => {
  const [form] = Form.useForm<registerFormValues>();
  const navigate = useNavigate();

  const handleRegister = async (values: registerFormValues) => {
    try {
      const param = {
        ...values,
        role: 0, // 普通用户
        age: 18,
      };
      const res = await registerApi(param);
      message.success(res.msg);
      navigate("/login");
      form.resetFields(); // 注册成功也清空
    } catch (err) {
      message.error("Registration failed: " + (err || "Unknown error"));
    }
  };

  return (
    <div className="signup-page">
      <div className="container">
        <Row
          gutter={48}
          align="middle"
        >
          <Col
            xs={0}
            md={12}
          >
            <div className="signup-image">
              <img
                src={login}
                alt="Car Wash"
              />
            </div>
          </Col>

          <Col
            xs={24}
            md={12}
          >
            <div className="signup-form-wrapper">
              <h1 className="form-title">Create an account</h1>
              <p className="form-subtitle">Enter your details below</p>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleRegister}
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
                    block
                  >
                    Create Account
                  </Button>
                </div>
              </Form>

              <p className="login-text">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="login-link"
                >
                  Login now
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Signup;
