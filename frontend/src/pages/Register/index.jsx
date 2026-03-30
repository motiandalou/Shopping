import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth";

export default function Register() {
  const navigate = useNavigate();

  // const onFinish = (values) => {
  //   // 本地存储注册信息
  //   localStorage.setItem("user", JSON.stringify(values));
  //   message.success("注册成功！请登录");
  //   navigate("/login");
  // };
  const onFinish = async (values) => {
    try {
      // 调用封装好的注册接口
      const res = await registerApi(values);

      // 接口调用成功
      message.success("注册成功！请登录");
      navigate("/login");
    } catch (err) {
      // 统一错误处理（你的响应拦截器已经处理了错误）
      message.error(err.message || "注册失败，请稍后重试");
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
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>注册</h2>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="设置账号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="设置密码" />
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
        </Form>
        <div style={{ textAlign: "center" }}>
          已有账号？<a onClick={() => navigate("/login")}>去登录</a>
        </div>
      </Card>
    </div>
  );
}
