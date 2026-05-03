import React, { useState, useEffect } from "react";
import { Card, Table, Button, Space, message, Modal } from "antd";
import { refundOrderList, auditRefund } from "@/api/order";
import ShoppingState from "@/components/Shopping_state";
import dayjs from "dayjs";
import "./index.less";

const ServiceAudit = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取售后工单列表
  const getList = async () => {
    setLoading(true);
    try {
      const params = {
        pageNum: 1,
        pageSize: 100,
        // 只查待审核的
        refundStatus: [1],
      };
      const res = await refundOrderList(params);
      setData(res.data?.records || []);
    } catch (err) {
      message.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  // 审核通过
  const handlePass = (record) => {
    Modal.confirm({
      title: "确认通过",
      content: "确定要通过该售后申请吗？",
      onOk: async () => {
        await auditRefund(record.id, 2, "审核通过");
        message.success("审核成功");
        getList();
      },
    });
  };

  // 驳回
  const handleReject = (record) => {
    Modal.confirm({
      title: "确认驳回",
      content: "确定要驳回该售后申请吗？",
      onOk: async () => {
        await auditRefund(record.id, 4, "审核驳回");
        message.success("驳回成功");
        getList();
      },
    });
  };

  const columns = [
    { title: "售后工单号", dataIndex: "refundOrderNo" },
    { title: "关联订单", dataIndex: "orderNo" },
    { title: "申请用户", dataIndex: "userName" },
    { title: "申请原因", dataIndex: "refundReason" },
    {
      title: "申请时间",
      dataIndex: "refundApplyTime",
      render: (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "工单类型",
      dataIndex: "refundType",
      render: (type) => (type === 1 ? "仅退款" : "退货退款"),
    },
    {
      title: "审核状态",
      render: (_, record) => (
        <ShoppingState
          status={record.status}
          refundStatus={record.refundStatus}
          type="order"
        />
      ),
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space>
          {record.refundStatus === 1 && (
            <>
              <Button
                type="link"
                onClick={() => handlePass(record)}
              >
                审核通过
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleReject(record)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="service-table-card"
      title="售后审核"
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

export default ServiceAudit;
