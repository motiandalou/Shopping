import React, { useState, useEffect } from "react";
import { Card, Table, Input, Button, Space, message, Modal } from "antd";
import { refundOrderList, auditRefund } from "@/api/order";
import ShoppingState from "@/components/Shopping_state";
import dayjs from "dayjs";
import "./index.less";

const ServiceTicket = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchNo, setSearchNo] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);

  // 退款状态：0=无 1=待审核 2=审核通过 3=已退款 4=已拒绝 5=退款失败
  const statusFilters = [
    { text: "待审核", value: 1 },
    { text: "审核通过", value: 2 },
    { text: "已退款", value: 3 },
    { text: "审核驳回", value: 4 },
    { text: "退款失败", value: 5 },
  ];

  const getList = async () => {
    setLoading(true);
    try {
      const params = {
        pageNum: 1,
        pageSize: 100,
        refundStatus: selectedStatus,
      };

      const res = await refundOrderList(params);
      setData(res.data?.records || []);
    } catch (err) {
      message.error("加载失败");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 搜索 + 筛选状态变化 → 重新请求接口
  useEffect(() => {
    getList();
  }, [selectedStatus]);

  // 查看详情
  const handleView = (record) => {
    Modal.info({
      title: "售后工单详情",
      width: 600,
      content: (
        <div>
          <p>售后工单号：{record.refundOrderNo}</p>
          <p>关联订单号：{record.orderNo}</p>
          <p>用户：{record.userName}</p>
          <p>电话：{record.phone || "-"}</p>
          <p>申请原因：{record.refundReason}</p>
          <p>
            申请时间：
            {dayjs(record.refundApplyTime).format("YYYY-MM-DD HH:mm:ss")}
          </p>
        </div>
      ),
    });
  };

  // 审核处理
  const handleHandle = (record) => {
    Modal.confirm({
      title: "处理售后工单",
      content: "请选择处理方式",
      okText: "通过",
      cancelText: "驳回",
      onOk: async () => {
        await auditRefund(record.id, 2, "审核通过");
        message.success("审核成功");
        getList();
      },
      onCancel: async () => {
        await auditRefund(record.id, 4, "审核驳回");
        message.success("已驳回");
        getList();
      },
    });
  };

  const columns = [
    {
      title: "工单编号",
      dataIndex: "refundOrderNo",
    },
    {
      title: "工单类型",
      dataIndex: "refundType",
      render: (t) => (t === 1 ? "仅退款" : t === 2 ? "退货退款" : "-"),
    },
    {
      title: "状态",
      dataIndex: "refundStatus",
      render: (_, record) => (
        <ShoppingState
          status={record.status}
          refundStatus={record.refundStatus}
          type="order"
        />
      ),
      filters: statusFilters,
      filterMultiple: true,
      filteredValue: selectedStatus,
    },
    {
      title: "用户信息",
      render: (_, record) => (
        <div>
          {record.userName} / {record.phone || "-"}
        </div>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "refundApplyTime",
      render: (t) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
    // {
    //   title: "操作",
    //   render: (_, record) => (
    //     <Space>
    //       <Button
    //         type="link"
    //         onClick={() => handleView(record)}
    //       >
    //         查看
    //       </Button>
    //       {record.refundStatus === 1 && (
    //         <Button
    //           type="link"
    //           onClick={() => handleHandle(record)}
    //         >
    //           处理
    //         </Button>
    //       )}
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Card
      className="service-table-card"
      title="售后工单列表"
    >
      <div
        className="search-bar"
        style={{ marginBottom: 16, gap: 8, display: "flex" }}
      >
        <Input
          placeholder="请输入工单编号 / 订单号"
          style={{ width: 280 }}
          value={searchNo}
          onChange={(e) => setSearchNo(e.target.value)}
        />
        <Button
          type="primary"
          onClick={getList}
        >
          搜索
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        onChange={(_, filters) => {
          setSelectedStatus(filters.refundStatus || []);
        }}
      />
    </Card>
  );
};

export default ServiceTicket;
