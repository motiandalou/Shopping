import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Rate,
  Space,
  Spin,
  message,
  Modal,
} from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getFavoriteList, deleteFavorite, clearFavorite } from "@/api/favorite";
import { addCart } from "@/api/cart";
import "./index.less";

const { Meta } = Card;

// 收藏项类型
interface FavoriteItem {
  id: number;
  userId: number;
  goodsId: number;
  goodsName: string;
  coverImg: string;
  price: number;
}

const Wishlist: React.FC = () => {
  // 收藏列表、加载状态
  const [favoriteList, setFavoriteList] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 页面初始化加载收藏列表
  useEffect(() => {
    fetchFavoriteList();
  }, []);

  // 获取收藏列表
  const fetchFavoriteList = async () => {
    setLoading(true);
    try {
      const res = await getFavoriteList();
      if (res.code === 200) {
        setFavoriteList(res.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 删除单条收藏
  const handleDelete = async (favId: number) => {
    try {
      const res = await deleteFavorite(favId);
      message.success(res.msg);
      // 刷新列表
      fetchFavoriteList();
    } catch (err) {
      console.log(err);
    }
  };

  // 加入购物车并自动移除收藏
  const handleAddToCart = async (
    goodsId: number,
    price: number,
    favId: number,
  ) => {
    try {
      const resCart = await addCart({
        goodsId,
        quantity: 1,
        price,
      });
      message.success(resCart.msg);
      // 自动删除收藏
      await deleteFavorite(favId);
      fetchFavoriteList();
    } catch (err) {
      console.log(err);
      message.error("加入购物车失败");
    }
  };

  // 一键清空所有收藏
  const handleClearAll = () => {
    Modal.confirm({
      title: "Prompt",
      content: "Are you sure to clear all wishlist items?",
      onOk: async () => {
        try {
          const res = await clearFavorite();
          setFavoriteList([]);
          message.success(res.msg);
        } catch (err) {
          console.log(err);
        }
      },
    });
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* 收藏列表区域 */}
        <div className="wishlist-section">
          <div className="section-header">
            <h2>My Wishlist ({favoriteList.length})</h2>
            <Button
              size="large"
              danger
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </div>

          <Spin spinning={loading}>
            <Row gutter={[24, 24]}>
              {favoriteList.length > 0 ? (
                favoriteList.map((item) => (
                  <Col
                    key={item.id}
                    xs={24}
                    sm={12}
                    md={6}
                  >
                    <Card
                      className="wishlist-card"
                      cover={
                        <div className="product-image-wrapper">
                          {/* 删除收藏按钮 */}
                          <Button
                            shape="circle"
                            icon={<DeleteOutlined />}
                            className="delete-btn"
                            onClick={() => handleDelete(item.id)}
                          />
                          <img
                            alt={item.goodsName}
                            src={item.coverImg}
                            className="product-image"
                          />
                          {/* 加入购物车 */}
                          <Button
                            type="primary"
                            block
                            className="add-to-cart-btn"
                            onClick={() =>
                              handleAddToCart(item.goodsId, item.price, item.id)
                            }
                          >
                            <ShoppingCartOutlined /> Add To Cart
                          </Button>
                        </div>
                      }
                    >
                      <Meta
                        title={item.goodsName}
                        description={
                          <Space
                            direction="vertical"
                            size={4}
                            style={{ width: "100%" }}
                          >
                            <Space>
                              <span className="price">¥{item.price}</span>
                            </Space>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col
                  span={24}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  No items in wishlist
                </Col>
              )}
            </Row>
          </Spin>
        </div>

        {/* 为你推荐 */}
        <div className="just-for-you-section">
          <div className="section-header">
            <div className="section-tag">
              <div className="tag-indicator" />
              <span>Just For You</span>
            </div>
            <Link to="/products">
              <Button size="large">See All</Button>
            </Link>
          </div>

          <Row gutter={[24, 24]}>
            {Array.from({ length: 4 }, (_, i) => ({
              id: i + 10,
              name: `Recommended Product ${i + 1}`,
              price: Math.floor(Math.random() * 300) + 50,
              originalPrice: Math.floor(Math.random() * 400) + 100,
              discount: Math.floor(Math.random() * 50) + 10,
              rating: Math.floor(Math.random() * 2) + 3,
              reviews: Math.floor(Math.random() * 100) + 20,
              image: `https://picsum.photos/300/300?random=${i}`,
            })).map((product) => (
              <Col
                key={product.id}
                xs={24}
                sm={12}
                md={6}
              >
                <Link to={`/product/${product.id}`}>
                  <Card
                    className="product-card"
                    cover={
                      <div className="product-image-wrapper">
                        {product.discount && (
                          <div className="discount-badge">
                            -{product.discount}%
                          </div>
                        )}
                        <Button
                          shape="circle"
                          icon={<EyeOutlined />}
                          className="view-btn"
                        />
                        <img
                          alt={product.name}
                          src={product.image}
                          className="product-image"
                        />
                      </div>
                    }
                  >
                    <Meta
                      title={product.name}
                      description={
                        <Space
                          direction="vertical"
                          size={4}
                          style={{ width: "100%" }}
                        >
                          <Space>
                            <span className="price">¥{product.price}</span>
                            {product.originalPrice && (
                              <span className="original-price">
                                ¥{product.originalPrice}
                              </span>
                            )}
                          </Space>
                          <Space>
                            <Rate
                              disabled
                              value={product.rating}
                              style={{ fontSize: 14 }}
                            />
                            <span className="reviews">({product.reviews})</span>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
