import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/token";
import { loginApi } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginApi(values);
      setToken(res.data.token);
      message.success(res.msg);
      navigate("/dashboard");
    } catch (err) {
      message.error("登录失败");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>登录</h2>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="账号" />
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
        </Form>

        <div style={{ textAlign: "center" }}>
          没有账号？<a onClick={() => navigate("/register")}>去注册</a>
        </div>
      </Card>
    </div>
  );
}
