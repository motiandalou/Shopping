import { Card, Table, DatePicker, Input, Button, Space } from "antd";

export default function OperationLog() {
  const columns = [
    { title: "操作人", dataIndex: "username" },
    { title: "操作内容", dataIndex: "content" },
    { title: "操作IP", dataIndex: "ip" },
    { title: "操作时间", dataIndex: "createTime" },
  ];

  return (
    <Card
      title="操作日志"
      bordered={false}
    >
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="操作人账号" />
        <DatePicker placeholder="选择日期" />
        <Button type="primary">查询</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={[]}
        rowKey="id"
      />
    </Card>
  );
}
