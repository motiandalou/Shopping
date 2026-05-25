import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Button,
  Rate,
  Space,
  InputNumber,
  Radio,
  Breadcrumb,
  Card,
  Divider,
  message,
} from "antd";
import {
  HeartOutlined,
  TruckOutlined,
  ReloadOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./index.less";
import { addCart } from "../../../../api/cart";
import { getGoodsDetail } from "../../../../api/goods";

const { Meta } = Card;

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
}

// 加入购物车
const handleAddToCart = async (product: Product) => {
  try {
    const res = await addCart({
      goodsId: product.id,
      quantity: product.quantity,
      price: product.price,
    });
    message.success(res.msg);
  } catch (err) {
    console.log(err);
  }
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("red");

  const product: Product = {
    id: id || "1",
    name: "Havic HV G-92 Gamepad",
    price: 192,
    originalPrice: 400,
    rating: 4.5,
    reviews: 150,
    inStock: true,
    description:
      "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585155770077-bf6f4a3b0e73?w=600&h=600&fit=crop",
    ],
    colors: ["red", "blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
  };

  const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i + 100,
    name: `Related Product ${i + 1}`,
    price: Math.floor(Math.random() * 300) + 50,
    rating: Math.floor(Math.random() * 2) + 3,
    reviews: Math.floor(Math.random() * 100) + 20,
    image: `https://images.unsplash.com/photo-${1600000000000 + i * 10000000}?w=300&h=300&fit=crop`,
  }));

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">{t("nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/products">Products</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Product Details */}
        <Row
          gutter={48}
          className="product-section"
        >
          {/* Images */}
          <Col
            xs={24}
            md={12}
          >
            <div className="product-images">
              <div className="main-image">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                />
              </div>
              <div className="thumbnail-images">
                <Row gutter={16}>
                  {product.images.map((image, index) => (
                    <Col
                      key={index}
                      span={6}
                    >
                      <div
                        className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image}
                          alt=""
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Col>

          {/* Product Info */}
          <Col
            xs={24}
            md={12}
          >
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <Space
                size="middle"
                className="product-meta"
              >
                <Rate
                  disabled
                  value={product.rating}
                />
                <span className="reviews">
                  ({product.reviews} {t("product.reviews")})
                </span>
                <Divider type="vertical" />
                <span
                  className={`stock-status ${product.inStock ? "in-stock" : "out-stock"}`}
                >
                  {product.inStock
                    ? t("product.in_stock")
                    : t("product.out_of_stock")}
                </span>
              </Space>

              <div className="price-section">
                <span className="price">${product.price}</span>
                <span className="original-price">${product.originalPrice}</span>
              </div>

              <p className="product-description">{product.description}</p>

              <Divider />

              {/* Colors */}
              <div className="option-section">
                <h4>{t("product.colors")}:</h4>
                <Radio.Group
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {product.colors.map((color) => (
                    <Radio.Button
                      key={color}
                      value={color}
                      className="color-option"
                      style={{
                        background: color,
                        border:
                          selectedColor === color
                            ? "2px solid #000"
                            : "1px solid #d9d9d9",
                      }}
                    />
                  ))}
                </Radio.Group>
              </div>

              {/* Sizes */}
              <div className="option-section">
                <h4>{t("product.size")}:</h4>
                <Radio.Group
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes.map((size) => (
                    <Radio.Button
                      key={size}
                      value={size}
                    >
                      {size}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="action-section">
                <div className="quantity-selector">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  />
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    variant="borderless"
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setQuantity(quantity + 1)}
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  {t("product.add_to_cart")}
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  className="wishlist-btn"
                />
              </div>

              {/* Delivery Info */}
              <div className="delivery-info">
                <div className="info-item">
                  <TruckOutlined className="info-icon" />
                  <div>
                    <h4>Free Delivery</h4>
                    <p>Enter your postal code for Delivery Availability</p>
                  </div>
                </div>
                <div className="info-item">
                  <ReloadOutlined className="info-icon" />
                  <div>
                    <h4>Return Delivery</h4>
                    <p>Free 30 Days Delivery Returns. Details</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Related Products */}
        <div className="related-section">
          <div className="section-header">
            <div className="section-tag">
              <div className="tag-indicator" />
              <span>{t("product.related_items")}</span>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {relatedProducts.map((relatedProduct) => (
              <Col
                key={relatedProduct.id}
                xs={24}
                sm={12}
                md={6}
              >
                <Link to={`/product/${relatedProduct.id}`}>
                  <Card
                    className="related-product-card"
                    cover={
                      <img
                        alt={relatedProduct.name}
                        src={relatedProduct.image}
                      />
                    }
                  >
                    <Meta
                      title={relatedProduct.name}
                      description={
                        <Space
                          direction="vertical"
                          size={4}
                          style={{ width: "100%" }}
                        >
                          <span className="price">${relatedProduct.price}</span>
                          <Space>
                            <Rate
                              disabled
                              value={relatedProduct.rating}
                              style={{ fontSize: 14 }}
                            />
                            <span className="reviews">
                              ({relatedProduct.reviews})
                            </span>
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

export default ProductDetail;
