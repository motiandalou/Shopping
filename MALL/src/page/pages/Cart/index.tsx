import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Table,
  InputNumber,
  Button,
  Input,
  Breadcrumb,
  Empty,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { ColumnsType } from "antd/es/table";
import "./index.less";

import {
  getCartList,
  updateCart,
  deleteCart,
  clearCart,
} from "../../../api/cart";

interface CartItem {
  coverImg: string;
  goodsId: number;
  goodsName: string;
  id: number;
  price: number;
  quantity: number;
  selected: number;
  userId: number;
}

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取购物车
  const fetchCartList = async () => {
    setLoading(true);
    try {
      const res = await getCartList();
      if (res.code === 200) {
        setCartItems(res.data);
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

  useEffect(() => {
    fetchCartList();
  }, []);

  // 更新数量
  const updateQuantity = async (id: number, quantity: number) => {
    try {
      await updateCart({
        id: id,
        quantity: quantity,
      });
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 删除商品
  const removeItem = async (id: number) => {
    try {
      await deleteCart(id);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // 清空购物车
  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (err) {
      console.log(err);
    }
  };

  // 计算总价
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const columns: ColumnsType<CartItem> = [
    {
      title: t("cart.product"),
      dataIndex: "goodsName",
      key: "goodsName",
      render: (text, record) => (
        <div className="product-cell">
          <img
            src={record.coverImg}
            alt={text}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: t("cart.price"),
      dataIndex: "price",
      key: "price",
      render: (price) => <span>${price}</span>,
    },
    {
      title: t("cart.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.id, value || 1)}
        />
      ),
    },
    {
      title: t("cart.subtotal"),
      key: "subtotal",
      render: (_, record) => (
        <span className="subtotal">${record.price * record.quantity}</span>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ];

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item>
              <Link to="/">{t("nav.home")}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t("nav.cart")}</Breadcrumb.Item>
          </Breadcrumb>

          <Empty
            description={t("cart.your_cart")}
            className="empty-cart"
          >
            <Link to="/products">
              <Button
                type="primary"
                size="large"
              >
                {t("cart.continue_shopping")}
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">{t("nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("nav.cart")}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={32}>
          <Col
            xs={24}
            lg={16}
          >
            <div className="cart-table">
              <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="id"
                pagination={false}
                loading={loading}
              />
            </div>

            <div className="cart-actions">
              <Link to="/products">
                <Button size="large">{t("cart.return_to_shop")}</Button>
              </Link>

              <Button
                size="large"
                danger
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </Col>

          <Col
            xs={24}
            lg={8}
          >
            <div className="cart-summary">
              <h3 className="summary-title">{t("cart.cart_total")}</h3>

              <div className="summary-row">
                <span>{t("cart.subtotal")}:</span>
                <span>${subtotal}</span>
              </div>

              <div className="summary-row">
                <span>{t("cart.shipping")}:</span>
                <span className="free">{t("cart.free_shipping")}</span>
              </div>

              <div className="summary-row total">
                <span>{t("cart.total")}:</span>
                <span>${total}</span>
              </div>

              <Link to="/checkout">
                <Button
                  type="primary"
                  size="large"
                  block
                >
                  {t("cart.proceed_checkout")}
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;
