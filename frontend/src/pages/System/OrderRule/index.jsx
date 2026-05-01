import { Card, Form, InputNumber, Button, Switch } from "antd";

export default function OrderRule() {
  return (
    <Card
      title="订单/售后规则配置"
      bordered={false}
    >
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
    </Card>
  );
}
