import React, { useState, useEffect } from "react";
import { List, Card, Empty, Tag, Button, Tooltip, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { getOrdersList } from "@/api/order";
import dayjs from "dayjs";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // 加载订单
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrdersList({ pageNum: 1, pageSize: 10 });
      setOrders(res.data || []);
    } catch (err) {
      console.error("获取订单失败", err);
    }
  };

  // 订单状态
  const getOrderStatus = (refundStatus, status) => {
    // 优先判断售后状态
    if (refundStatus === 1) return { text: "售后处理中", color: "orange" };
    if (refundStatus === 2) return { text: "售后通过", color: "blue" };
    if (refundStatus === 3) return { text: "已退款", color: "green" };
    if (refundStatus === 4) return { text: "售后拒绝", color: "red" };

    // 无售后时，用订单主状态
    const statusMap = {
      0: { text: "待付款", color: "default" },
      1: { text: "已付款", color: "blue" },
      2: { text: "已发货", color: "cyan" },
      3: { text: "已完成", color: "green" },
      4: { text: "已关闭", color: "red" },
    };
    return statusMap[status] || { text: "未知", color: "default" };
  };

  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <Card title="我的订单">
        {orders.length === 0 ? (
          <Empty description="暂无订单" />
        ) : (
          <List
            dataSource={orders}
            renderItem={(item) => {
              const status = getOrderStatus(item.refundStatus, item.status);
              return (
                <List.Item
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      width: "100%",
                    }}
                  >
                    {/* 订单号 + 状态 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>订单号：{item.orderNo}</div>
                      <Tag
                        style={{
                          fontSize: 16,
                        }}
                        color={status.color}
                      >
                        {status.text}
                      </Tag>
                    </div>

                    {/* 商品信息 */}
                    <div>
                      <div style={{ fontSize: 13, color: "#666" }}>商品</div>
                      <div style={{ marginTop: 4 }}>{item.goodsInfo}</div>
                    </div>

                    {/* 金额 + 时间 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#666",
                        fontSize: 13,
                      }}
                    >
                      <div>实付：¥{item.totalAmount}</div>
                      <div>
                        {dayjs(item.createTime).format("YYYY-MM-DD HH:mm")}
                      </div>
                    </div>

                    {/* 操作按钮（大厂标准：查看详情） */}
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        type="primary"
                        onClick={() => navigate(`/order/detail/${item.id}`)}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
}
