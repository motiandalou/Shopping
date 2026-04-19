import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { getCartList, updateCart, deleteCart, clearCart } from "../../api/cart";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartList();
  }, []);

  const fetchCartList = async () => {
    setLoading(true);
    try {
      const res = await getCartList();
      if (res.code === 200) {
        setCart(res.data);
      } else {
        message.error(res.msg || "获取购物车失败");
      }
    } catch (err) {
      console.error(err);
      message.error("网络异常");
    } finally {
      setLoading(false);
    }
  };

  const changeNum = async (id, num) => {
    try {
      const res = await updateCart({
        id: id,
        quantity: num,
      });

      if (res.code === 200) {
        fetchCartList();
        message.success("修改成功");
      } else {
        message.error(res.msg || "修改失败");
      }
    } catch (err) {
      message.error("修改失败");
    }
  };

  const del = async (id) => {
    try {
      const res = await deleteCart(id);
      if (res.code === 200) {
        fetchCartList();
        // 刷新页面，重新获取购物车数量
        window.history.go(0);
      } else {
        message.error(res.msg || "删除失败");
      }
    } catch (err) {
      message.error("删除失败");
    }
  };

  // 计算合计并保留2位小数
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const columns = [
    {
      title: "商品",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={record.coverImg}
            alt={record.goodsName}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/60";
            }}
          />
          <span>{record.goodsName}</span>
        </div>
      ),
    },
    { title: "单价", dataIndex: "price", render: (p) => `¥${p.toFixed(2)}` },
    {
      title: "数量",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => changeNum(record.id, value)}
        />
      ),
    },
    {
      title: "小计",
      render: (r) => `¥${(r.price * r.quantity).toFixed(2)}`,
    },
    {
      title: "操作",
      render: (record) => (
        <Button
          danger
          onClick={() => del(record.id)}
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
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>加载中...</div>
      ) : cart.length === 0 ? (
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
            {/* 【关键】合计：同样保留2位小数 */}
            <h3>合计：¥{total.toFixed(2)}</h3>
            <Button
              type="primary"
              size="large"
              onClick={toOrder}
            >
              结算
            </Button>
          </div>
        </>
      )}
    </>
  );
}
