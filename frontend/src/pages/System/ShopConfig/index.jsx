import { Card, Form, Input, Button, InputNumber, Switch, Tabs } from "antd";

export default function ShopSetting() {
  return (
    <Card
      title="店铺配置"
      bordered={false}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "基础设置",
            children: (
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
              >
                <Form.Item label="店铺名称">
                  <Input placeholder="请输入店铺名称" />
                </Form.Item>
                <Form.Item label="联系电话">
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
                <Form.Item label="店铺地址">
                  <Input placeholder="请输入店铺地址" />
                </Form.Item>
                <Form.Item label="营业时间">
                  <Input placeholder="例如 08:00 - 22:00" />
                </Form.Item>
                <Form.Item label="店铺简介">
                  <Input.TextArea
                    rows={4}
                    placeholder="请输入店铺简介"
                  />
                </Form.Item>
                <Form.Item label="包邮门槛">
                  <InputNumber
                    placeholder="满多少包邮"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary">保存配置</Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "2",
            label: "订单/售后规则",
            children: (
              <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                <Form.Item label="未付款超时关闭(分钟)">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="默认15"
                  />
                </Form.Item>
                <Form.Item label="发货后自动确认收货(天)">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="默认7"
                  />
                </Form.Item>
                <Form.Item label="售后可申请期限(天)">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="默认7"
                  />
                </Form.Item>
                <Form.Item label="超时自动同意售后">
                  <Switch />
                </Form.Item>
                <Form.Item label="新订单自动推送通知">
                  <Switch />
                </Form.Item>
                <Form.Item>
                  <Button type="primary">保存规则</Button>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
}
