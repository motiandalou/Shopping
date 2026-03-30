import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/token";

export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { username, password } = values;

    // 模拟登录：从本地取注册信息
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user, username, password);

    if (user && user.username === username && user.password === password) {
      setToken("login_success_" + Date.now());
      message.success("登录成功");
      navigate("/dashboard");
    } else {
      message.error("账号或密码错误");
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
