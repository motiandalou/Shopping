import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import request from "../api/request";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const res = await request.post("/user/login", values);
      localStorage.setItem("token", res.token);
      message.success("Login Success");
      navigate("/");
    } catch (error) {
      message.error("Login Failed");
    }
  };

  const TestConnect = () => {
    const testApi = async () => {
      try {
        const res = await request.get("/login/list"); // 对应后端 /api/list
        console.log("✅ 连接成功！后端返回：", res);
        alert("前后端连通成功！\n数据：" + JSON.stringify(res));
      } catch (err) {
        console.error("❌ 连接失败：", err);
        alert("连接失败，请检查后端是否启动！");
      }
    };

    return <button onClick={testApi}>测试前后端连接</button>;
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
      <TestConnect />
      <h2 style={{ textAlign: "center" }}>Login</h2>
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center" }}>
        No account?
        <span
          onClick={() => navigate("/register")}
          style={{ color: "#1677ff", marginLeft: 5, cursor: "pointer" }}
        >
          Register
        </span>
      </div>
    </div>
  );
}
