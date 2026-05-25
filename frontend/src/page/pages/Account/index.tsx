import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Menu,
  Form,
  Input,
  Button,
  Breadcrumb,
  DatePicker,
  Select,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import "./index.less";
import { getUserInfo, updateUserProfile, updateUserPwd } from "@/api/user";
import dayjs from "dayjs";

interface UserInfo {
  userName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  gender: string;
}

const Account: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [userName, setUserName] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const onFinish = async (values: any) => {
    try {
      const profileParams = {
        userName: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format("YYYY-MM-DD")
          : null,
        gender: values.gender,
      };
      // 修改--基本信息
      let res;
      res = await updateUserProfile(profileParams);

      if (
        values.currentPassword &&
        values.newPassword &&
        values.confirmPassword
      ) {
        const pwdParams = {
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };
        // 修改密码
        res = await updateUserPwd(pwdParams);
        if (res.success) {
          // 替换本地双Token
          const { accessToken, refreshToken } = res.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }
      }

      message.success(res.msg);
      // 刷新
      fetchUserInfo();
      // 置空值
      form.resetFields(["currentPassword", "newPassword", "confirmPassword"]);
    } catch (err: any) {
      message.error(err.message || "修改失败");
    }
  };

  // 请求用户信息
  const fetchUserInfo = async () => {
    const res = await getUserInfo();
    const data = res.data;
    setUserName(data.userName);
    setUserInfo(data);
    form.setFieldsValue({
      name: data.userName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      birthDate: data.birthDate ? dayjs(data.birthDate) : null,
      gender: data.gender,
    });
  };

  useEffect(() => {
    fetchUserInfo();
  }, [form]);

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">{t("nav.home")}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t("nav.account")}</Breadcrumb.Item>
          </Breadcrumb>
          <p className="welcome-text">
            Welcome! <span className="username">{userName}</span>
          </p>
        </div>

        <Row gutter={32}>
          <Col
            xs={24}
            md={6}
          >
            <div className="account-sidebar">
              <Menu
                mode="vertical"
                defaultSelectedKeys={["profile"]}
              >
                <Menu.ItemGroup title="Manage My Account">
                  <Menu.Item key="profile">My Profile</Menu.Item>
                  <Menu.Item key="address">Address Book</Menu.Item>
                  <Menu.Item key="payment">My Payment Options</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="My Orders">
                  <Menu.Item key="returns">My Returns</Menu.Item>
                  <Menu.Item key="cancellations">My Cancellations</Menu.Item>
                </Menu.ItemGroup>
                <Menu.Item key="wishlist">
                  <Link to="/wishlist">My Wishlist</Link>
                </Menu.Item>
              </Menu>
            </div>
          </Col>

          <Col
            xs={24}
            md={18}
          >
            <div className="account-content">
              <h2 className="content-title">Edit Your Profile</h2>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col
                    xs={24}
                    sm={12}
                  >
                    <Form.Item
                      label="Name"
                      name="name"
                    >
                      <Input
                        size="large"
                        placeholder="Enter your Name"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                  >
                    <Form.Item
                      label="Phone"
                      name="phone"
                    >
                      <Input
                        placeholder="Enter your phone number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col
                    xs={24}
                    sm={12}
                  >
                    <Form.Item
                      label="Email"
                      name="email"
                    >
                      <Input
                        size="large"
                        placeholder="Enter your Email"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                  >
                    <Form.Item
                      label="Address"
                      name="address"
                    >
                      <Input
                        size="large"
                        placeholder="Enter your Address"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col
                    xs={24}
                    sm={12}
                  >
                    <Form.Item
                      label="Birth Date"
                      name="birthDate"
                    >
                      <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={12}
                  >
                    <Form.Item
                      label="Gender"
                      name="gender"
                    >
                      <Select size="large">
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <h3 className="section-title">Password Changes</h3>

                <Form.Item name="currentPassword">
                  <Input.Password
                    placeholder="Current Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item name="newPassword">
                  <Input.Password
                    placeholder="New Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item name="confirmPassword">
                  <Input.Password
                    placeholder="Confirm New Password"
                    size="large"
                  />
                </Form.Item>

                <div className="form-actions">
                  <Button size="large">{t("common.cancel")}</Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                  >
                    {t("common.save")}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Account;
