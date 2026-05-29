import { useEffect } from "react";
import { Card, Form, Input, Button, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useTheme from "@/hooks/useTheme";
import "./index.less";
import { updateStaff, getStaffInfo } from "@/api/staff";

export default function Profile() {
  const { theme } = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    // 获取个人信息
    const fetchStaffInfo = async () => {
      const res = await getStaffInfo();
      if (res.success) {
        const { id, userName, realName, phone, email } = res.data;
        form.setFieldsValue({
          id,
          userName,
          realName,
          phone,
          email,
        });
      }
    };
    fetchStaffInfo();
  }, [form]);

  // 保存修改
  const handleSave = async (values) => {
    try {
      const params = {
        id: values.id,
        realName: values.realName,
        phone: values.phone,
        email: values.email,
      };
      if (values.password) {
        params.password = values.password;
      }
      const res = await updateStaff(params);
      if (res.success) {
        // 刷新页面
        window.location.reload();
      } else {
        console.error(res.msg || "保存失败");
      }
    } catch (err) {
      console.error("保存个人信息失败", err);
    }
  };

  return (
    <div className="profile-container">
      <Card
        className="profile-card"
        variant="borderless"
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
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="userName"
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
            label="邮箱"
            name="email"
          >
            <Input placeholder="请输入邮箱地址" />
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
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
