import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Rate, Space } from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./index.less";

const { Meta } = Card;

const Wishlist: React.FC = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Gucci duffle bag",
      price: 960,
      originalPrice: 1160,
      discount: 35,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "RGB liquid CPU Cooler",
      price: 1960,
      image:
        "https://images.unsplash.com/photo-1591238868585-1a8b0ac9d44f?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      name: "GP11 Shooter USB Gamepad",
      price: 550,
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Quilted Satin Jacket",
      price: 750,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
    },
  ];

  const justForYou = Array.from({ length: 4 }, (_, i) => ({
    id: i + 5,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 300) + 50,
    originalPrice: Math.floor(Math.random() * 400) + 100,
    discount: Math.floor(Math.random() * 50) + 10,
    rating: Math.floor(Math.random() * 2) + 3,
    reviews: Math.floor(Math.random() * 100) + 20,
    image: `https://images.unsplash.com/photo-${1600000000000 + i * 10000000}?w=300&h=300&fit=crop`,
  }));

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Wishlist Section */}
        <div className="wishlist-section">
          <div className="section-header">
            <h2>Wishlist ({wishlistItems.length})</h2>
            <Button size="large">Move All To Bag</Button>
          </div>

          <Row gutter={[24, 24]}>
            {wishlistItems.map((item) => (
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
                      {item.discount && (
                        <div className="discount-badge">-{item.discount}%</div>
                      )}
                      <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        className="delete-btn"
                      />
                      <img
                        alt={item.name}
                        src={item.image}
                        className="product-image"
                      />
                      <Button
                        type="primary"
                        block
                        className="add-to-cart-btn"
                      >
                        <ShoppingCartOutlined /> Add To Cart
                      </Button>
                    </div>
                  }
                >
                  <Meta
                    title={item.name}
                    description={
                      <Space
                        direction="vertical"
                        size={4}
                        style={{ width: "100%" }}
                      >
                        <Space>
                          <span className="price">${item.price}</span>
                          {item.originalPrice && (
                            <span className="original-price">
                              ${item.originalPrice}
                            </span>
                          )}
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Just For You Section */}
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
            {justForYou.map((product) => (
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
                            <span className="price">${product.price}</span>
                            {product.originalPrice && (
                              <span className="original-price">
                                ${product.originalPrice}
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
