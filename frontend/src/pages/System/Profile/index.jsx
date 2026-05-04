import { useEffect } from "react";
import { Card, Form, Input, Button, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useTheme from "@/hooks/useTheme";
import "./index.less";
import { updateStaff } from "@/api/staff";

export default function Profile() {
  const { theme } = useTheme();
  const [form] = Form.useForm();

  // 读取本地用户信息
  const userStr = localStorage.getItem("userInfo");
  const userInfo = userStr ? JSON.parse(userStr) : {};

  // 页面加载时回填表单
  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        username: userInfo.userName,
        realName: userInfo.realName,
        phone: userInfo.phone || "",
      });
    }
  }, [userInfo, form]);

  // 保存修改（预留接口位置）
  const handleSave = async (values) => {
    try {
      const params = {
        id: userInfo.id,
        realName: values.realName,
        phone: values.phone,
      };
      if (values.password) {
        params.password = values.password;
      }
      const res = await updateStaff(params);
      if (res.success) {
        // 更新本地存储的用户信息
        const updatedUserInfo = { ...userInfo, ...params };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

        // 成功后 强制刷新页面
        window.location.reload();
      } else {
        message.error(res.msg);
      }
    } catch (err) {
      console.error("保存个人信息失败", err);
    }
  };

  return (
    <div className="profile-container">
      <Card
        className="profile-card"
        bordered={false}
      >
        {/* 头像区域 */}
        <div className="profile-avatar-box">
          <Avatar
            size={90}
            icon={<UserOutlined />}
          />
        </div>

        {/* 表单 */}
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          className="profile-form"
          onFinish={handleSave}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input
              disabled
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            label="真实姓名"
            name="realName"
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            label="修改密码"
            name="password"
          >
            <Input.Password placeholder="不修改请留空" />
          </Form.Item>

          <Form.Item className="profile-form-btn">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
