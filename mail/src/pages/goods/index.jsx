import React, { useState, useEffect } from "react";
import { Row, Col, message, Tag } from "antd";
import { FireOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { getGoodsList } from "../../api/goods";
import { addCart } from "../../api/cart";

export default function Goods() {
  // 商品列表状态
  const [goodsList, setGoodsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 路由跳转
  const navigate = useNavigate();

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

  // 加入购物车
  const handleAddCart = async (item, e) => {
    // 阻止事件冒泡，避免触发跳详情页
    e.stopPropagation();
    try {
      const res = await addCart({
        goodsId: item.id,
        quantity: 1,
        price: item.price,
      });

      if (res.code === 200) {
        message.success("加入购物车成功");
      } else {
        message.error(res.msg || "加入购物车失败");
      }
    } catch (err) {
      console.error(err);
      message.error("加入购物车失败，请稍后重试");
    }
  };

  // 点击跳转到商品详情
  const goToDetail = (id) => {
    navigate(`/goods/detail/${id}`);
  };

  return (
    <div className="jd-goods-page">
      <div className="jd-section-title">
        <FireOutlined style={{ color: "#e4393c", marginRight: 8 }} />
        限时秒杀
      </div>

      <Row gutter={[16, 16]}>
        {loading ? (
          <Col
            span={24}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            加载中...
          </Col>
        ) : goodsList.length === 0 ? (
          <Col
            span={24}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            暂无上架商品
          </Col>
        ) : (
          goodsList.map((item) => (
            <Col
              xs={12}
              sm={8}
              md={6}
              lg={6}
              key={item.id}
            >
              <div
                className="jd-product-card"
                onClick={() => goToDetail(item.id)}
              >
                {/* 商品图片 */}
                <div className="jd-product-img-wrap">
                  <img
                    src={item.coverImg}
                    alt={item.goodsName}
                    className="jd-product-img"
                    onError={(e) => {
                      e.target.src =
                        "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif";
                    }}
                  />
                  {/* 左上角标签（可选） */}
                  {item.tag && <div className="jd-product-tag">{item.tag}</div>}
                </div>

                {/* 商品信息 */}
                <div className="jd-product-info">
                  {/* 商品名称 */}
                  <div className="jd-product-name">{item.goodsName}</div>

                  {/* 价格区域 */}
                  <div className="jd-price-area">
                    <span className="jd-price-symbol">¥</span>
                    <span className="jd-price">{item.price}</span>
                    {item.originalPrice && (
                      <span className="jd-original-price">
                        ¥{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* 促销标签（可选） */}
                  {item.promotion && (
                    <div className="jd-promotion-tag">
                      <Tag color="red">{item.promotion}</Tag>
                    </div>
                  )}

                  {/* 销量/店铺信息 */}
                  <div className="jd-meta-info">
                    <span className="jd-sales">
                      {item.sales || "300+人看过"}
                    </span>
                    <span className="jd-shop-name">
                      {item.shopName || "官方旗舰店"}
                    </span>
                  </div>

                  {/* 加入购物车按钮 */}
                  <button
                    className="jd-add-cart-btn"
                    onClick={(e) => handleAddCart(item, e)}
                  >
                    <ShoppingCartOutlined style={{ marginRight: 4 }} />
                    加入购物车
                  </button>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}
