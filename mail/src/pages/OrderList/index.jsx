import React, { useState, useEffect } from "react";
import { List, Card, Empty, Tooltip } from "antd";
import { getOrdersList } from "../../api/order";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersList({ pageNum: 1, pageSize: 10 });
        setOrders(res.data || []);
      } catch (err) {
        console.error("获取订单失败", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <Card title="我的订单">
        {orders.length === 0 ? (
          <Empty description="暂无订单" />
        ) : (
          <List
            dataSource={orders}
            renderItem={(o) => (
              <List.Item
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "16px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {/* 订单号 */}
                <div style={{ flex: 1, minWidth: 160, maxWidth: 200 }}>
                  <div style={{ fontSize: 12, color: "#999" }}>订单号</div>
                  <Tooltip title={o.orderNo}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 14,
                        color: "#333",
                      }}
                    >
                      {o.orderNo}
                    </div>
                  </Tooltip>
                </div>

                {/* 下单时间 */}
                <div style={{ flex: 1, minWidth: 160, maxWidth: 200 }}>
                  <div style={{ fontSize: 12, color: "#999" }}>下单时间</div>
                  <div style={{ fontSize: 14, color: "#333" }}>
                    {o.createTime}
                  </div>
                </div>

                {/* 收货地址 */}
                <div style={{ flex: 1, minWidth: 160, maxWidth: 200 }}>
                  <div style={{ fontSize: 12, color: "#999" }}>收货地址</div>
                  <Tooltip title={o.address}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 14,
                        color: "#333",
                      }}
                    >
                      {o.address}
                    </div>
                  </Tooltip>
                </div>

                {/* 商品信息 */}
                <div style={{ flex: 2, minWidth: 260, maxWidth: 400 }}>
                  <div style={{ fontSize: 12, color: "#999" }}>商品</div>
                  <Tooltip title={o.goodsInfo}>
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 14,
                        color: "#333",
                      }}
                    >
                      {o.goodsInfo}
                    </div>
                  </Tooltip>
                </div>

                {/* 实付金额 */}
                <div style={{ textAlign: "right", minWidth: 100 }}>
                  <div style={{ fontSize: 12, color: "#999" }}>实付金额</div>
                  <div
                    style={{ color: "#ff4d4f", fontSize: 16, fontWeight: 600 }}
                  >
                    ¥{o.totalAmount}
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
