import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const param = {
        ...values,
        id: null, // 后端会自动生成ID，前端传null即可
        role: 1, // 1代表管理员 0代表普通用户
        age: 18, // 后端需要一个年龄字段，暂时写死为18
      };
      const res = await registerApi(param);

      // 接口调用成功
      message.success(res.message || "注册成功");
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
