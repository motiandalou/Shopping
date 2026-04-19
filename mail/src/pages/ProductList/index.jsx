import React, { useState, useEffect } from "react";
import { Row, Col, message } from "antd";
import { FireOutlined } from "@ant-design/icons";
import "../../App.css";
import { getGoodsList } from "../../api/goods";
import { addCart, clearCart } from "../../api/cart";

export default function ProductList() {
  // 商品列表状态
  const [goodsList, setGoodsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 页面加载请求接口
  useEffect(() => {
    fetchGoodsList();
  }, []);

  const fetchGoodsList = async () => {
    setLoading(true);
    try {
      const res = await getGoodsList({
        pageNum: 1,
        pageSize: 10,
      });

      if (res.code === 200 && res.data) {
        // 只保留【上架状态】的商品
        const onSaleGoods = res.data.filter((item) => {
          return (
            item.isOnSale === true ||
            item.status === 1 ||
            item.isPublish === 1 ||
            item.isUp === 1
          );
        });
        setGoodsList(onSaleGoods);
      } else {
        message.error("商品列表加载失败");
      }
    } catch (err) {
      console.error("请求失败：", err);
      message.error("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 改造：真实接口加入购物车（对接后端）
  const handleAddCart = async (item) => {
    try {
      // 调用后端接口
      const res = await addCart({
        goodsId: item.id, // 商品ID
        quantity: 1, // 数量1
        price: item.price, // 价格
      });

      if (res.code === 200) {
        window.history.go(0);
      } else {
        message.error(res.msg || "加入购物车失败");
      }
    } catch (err) {
      console.error(err);
      message.error("加入购物车失败，请稍后重试");
    }
  };

  return (
    <div>
      <div className="jd-seckill">
        <div className="jd-seckill-title">
          <FireOutlined /> 限时秒杀
        </div>
        <Row gutter={[20, 20]}>
          {loading ? (
            <Col
              span={24}
              style={{ textAlign: "center", padding: "20px" }}
            >
              加载中...
            </Col>
          ) : goodsList.length === 0 ? (
            <Col
              span={24}
              style={{ textAlign: "center", padding: "20px" }}
            >
              暂无上架商品
            </Col>
          ) : (
            goodsList.map((item) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                key={item.id}
              >
                <div className="jd-product-card">
                  <img
                    src={item.coverImg}
                    alt={item.goodsName}
                    className="jd-product-img"
                    onError={(e) => {
                      e.target.src =
                        "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif";
                    }}
                  />
                  <div className="jd-product-info">
                    <div className="jd-product-name">{item.goodsName}</div>
                    <div className="jd-product-price">¥{item.price}</div>
                    <button
                      className="jd-add-cart-btn"
                      onClick={() => handleAddCart(item)}
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
}
