import React, { useState, useEffect } from "react";
import { Card, Table, message } from "antd";
import { getOrderLogList } from "@/api/order";
import dayjs from "dayjs";
import "./index.less";

const ServiceTrace = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLogList = async () => {
    setLoading(true);
    try {
      const res = await getOrderLogList({ pageNum: 1, pageSize: 100 });
      setData(res.data?.records || []);
    } catch (err) {
      message.error("加载日志失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogList();
  }, []);

  const columns = [
    { title: "关联工单", dataIndex: "refundOrderNo", key: "refundOrderNo" },
    { title: "操作人", dataIndex: "operatorName", key: "operatorName" },
    { title: "操作内容", dataIndex: "operateContent", key: "operateContent" },
    {
      title: "操作时间",
      dataIndex: "createTime",
      render: (t) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
    { title: "IP地址", dataIndex: "ipAddress", key: "ipAddress" },
  ];

  return (
    <Card
      className="service-table-card"
      title="工单日志"
    >
      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ServiceTrace;
