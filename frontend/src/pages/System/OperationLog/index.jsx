import { Card, Table, DatePicker, Input, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { getLogList } from "@/api/log";
import dayjs from "dayjs";
import ShoppingState from "@/components/Shopping_state";

export default function OperationLog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 查询条件
  const [username, setUsername] = useState("");
  const [date, setDate] = useState(null);

  const columns = [
    { title: "操作人", dataIndex: "operatorName" },
    { title: "操作内容", dataIndex: "operation" },
    { title: "接口", dataIndex: "requestUrl" },
    { title: "操作时间", dataIndex: "createTime" },
    {
      title: "状态",
      dataIndex: "status",
      render: (text) => (
        <ShoppingState
          status={text}
          type="log"
        />
      ),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const params = {
      operatorName: username,
      date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    };

    try {
      const res = await getLogList(params);
      setData(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="操作日志"
      bordered={false}
    >
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="操作人账号"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <DatePicker
          placeholder="选择日期"
          onChange={(value) => setDate(value)}
        />

        <Button
          type="primary"
          onClick={loadData}
        >
          查询
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
}
