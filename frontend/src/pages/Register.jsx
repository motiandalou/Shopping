import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import request from "../api/request";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.warning("Password not match");
      return;
    }
    try {
      await request.post("/user/register", {
        username: values.username,
        password: values.password,
      });
      message.success("Register Success");
      navigate("/login");
    } catch (error) {
      message.error("Register Failed");
    }
  };

  return (
    <div
      style={{
        width: 400,
        margin: "100px auto",
        padding: 20,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center" }}>Register</h2>
      <Form
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input username" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm password" }]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Register
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        Already have an account?
        <span
          onClick={() => navigate("/login")}
          style={{ color: "#1677ff", marginLeft: 5, cursor: "pointer" }}
        >
          Login
        </span>
      </div>
    </div>
  );
}
