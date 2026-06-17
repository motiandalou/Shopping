import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Input, Button, Breadcrumb, Space } from "antd";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./index.less";

const { TextArea } = Input;

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Contact form:", values);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">{t("nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("nav.contact")}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={32}>
          <Col
            xs={24}
            md={8}
          >
            <Space
              direction="vertical"
              size={32}
              className="contact-info"
            >
              <div className="info-card">
                <div className="info-header">
                  <PhoneOutlined className="info-icon" />
                  <h3>Call To Us</h3>
                </div>
                <Space
                  direction="vertical"
                  size={8}
                >
                  <p>We are available 24/7, 7 days a week.</p>
                  <p className="highlight">Phone: +60 172543722</p>
                </Space>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <MailOutlined className="info-icon" />
                  <h3>Write To Us</h3>
                </div>
                <Space
                  direction="vertical"
                  size={8}
                >
                  <p>
                    Fill out our form and we will contact you within 24 hours.
                  </p>
                  <p className="highlight">
                    Emails: cn.jiangwei.1997@gmail.com
                  </p>
                </Space>
              </div>
            </Space>
          </Col>

          <Col
            xs={24}
            md={16}
          >
            <div className="contact-form-wrapper">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col
                    xs={24}
                    sm={8}
                  >
                    <Form.Item
                      name="name"
                      rules={[
                        { required: true, message: "Please input your name!" },
                      ]}
                    >
                      <Input
                        placeholder="Your Name *"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={8}
                  >
                    <Form.Item
                      name="email"
                      rules={[{ required: true, type: "email" }]}
                    >
                      <Input
                        placeholder="Your Email *"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={8}
                  >
                    <Form.Item
                      name="phone"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Your Phone *"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="message">
                  <TextArea
                    rows={8}
                    placeholder="Your Message"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Contact;
