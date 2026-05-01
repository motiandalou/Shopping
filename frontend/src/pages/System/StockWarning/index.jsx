import { Card, Form, InputNumber, Button, Table } from "antd";

export default function StockWarning() {
  const columns = [
    { title: "商品名称", dataIndex: "goodsName" },
    { title: "当前库存", dataIndex: "stockNum" },
    { title: "预警阈值", dataIndex: "warningNum" },
    { title: "状态", dataIndex: "status" },
    { title: "操作", render: () => <Button type="link">修改阈值</Button> },
  ];

  return (
    <Card
      title="库存预警配置"
      bordered={false}
    >
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        style={{ marginBottom: 20 }}
      >
        <Form.Item label="全局默认预警库存">
          <InputNumber
            style={{ width: "100%" }}
            placeholder="低于该数量预警"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary">保存全局设置</Button>
        </Form.Item>
      </Form>

      <Card
        size="small"
        title="商品库存预警列表"
      >
        <Table
          columns={columns}
          dataSource={[]}
          rowKey="id"
        />
      </Card>
    </Card>
  );
}
