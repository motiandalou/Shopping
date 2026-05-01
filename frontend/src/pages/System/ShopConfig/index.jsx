import { Card, Form, Input, Button, InputNumber } from "antd";

export default function ShopConfig() {
  return (
    <Card
      title="店铺配置"
      bordered={false}
    >
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
          {/* <TextArea
            rows={4}
            placeholder="请输入店铺简介"
          /> */}
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
    </Card>
  );
}
