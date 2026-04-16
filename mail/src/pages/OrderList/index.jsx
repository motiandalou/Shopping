import React, { useState, useEffect } from "react";
import { List, Card, Empty } from "antd";
import { getOrdersList } from "../../api/order";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 改成调用真实接口，而不是读取 localStorage
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
    <Card title="我的订单">
      {orders.length === 0 ? (
        <Empty />
      ) : (
        <List
          dataSource={orders}
          renderItem={(o) => (
            <List.Item>
              {/* 订单号 */}
              <div>订单号：{o.orderNo}</div>
              {/* 下单时间 */}
              <div>下单时间：{o.createTime}</div>
              {/* 收货地址 */}
              <div>收货地址：{o.address}</div>
              {/* 商品信息 */}
              <div>商品：{o.goodsInfo}</div>
              {/* 实付金额 */}
              <div style={{ color: "red", fontSize: 16 }}>
                实付：¥{o.totalAmount}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
