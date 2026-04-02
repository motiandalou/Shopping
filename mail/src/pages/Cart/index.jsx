import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const changeNum = (id, num) => {
    const list = cart.map((i) => (i.id === id ? { ...i, num } : i));
    setCart(list);
    localStorage.setItem("cart", JSON.stringify(list));
  };

  const del = (id) => {
    const list = cart.filter((i) => i.id !== id);
    setCart(list);
    localStorage.setItem("cart", JSON.stringify(list));
    message.success("删除成功");
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.num, 0);

  const columns = [
    { title: "商品", dataIndex: "name" },
    { title: "单价", dataIndex: "price", render: (p) => `¥${p}` },
    {
      title: "数量",
      render: (_, r) => (
        <InputNumber
          min={1}
          value={r.num}
          onChange={(v) => changeNum(r.id, v)}
        />
      ),
    },
    { title: "小计", render: (r) => `¥${r.price * r.num}` },
    {
      title: "操作",
      render: (r) => (
        <Button
          danger
          onClick={() => del(r.id)}
        >
          删除
        </Button>
      ),
    },
  ];

  const toOrder = () => {
    if (cart.length === 0) {
      message.warning("购物车为空");
      return;
    }
    navigate("/order");
  };

  return (
    <>
      {cart.length === 0 ? (
        <Empty description="购物车为空" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cart}
            rowKey="id"
            pagination={false}
          />
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <h3>合计：¥{total}</h3>
            <Button
              type="primary"
              size="large"
              onClick={toOrder}
            >
              去结算
            </Button>
          </div>
        </>
      )}
    </>
  );
}
