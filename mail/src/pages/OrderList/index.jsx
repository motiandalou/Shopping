import React, { useState, useEffect } from "react";
import { List, Card, Empty } from "antd";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(data);
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
              <div>订单号：{o.id}</div>
              <div>时间：{o.time}</div>
              <div>地址：{o.address}</div>
              <div>
                商品：{o.items.map((i) => `${i.name}×${i.num}`).join("，")}
              </div>
              <div style={{ color: "red", fontSize: 16 }}>实付：¥{o.total}</div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
