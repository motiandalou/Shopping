import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Rate, Space, Carousel } from "antd";
import heroEndframe from "../../assets/image/hero_endframe__cvklg0xk3w6e_large 2.png";
import {
  ArrowRightOutlined,
  HeartOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getCategoryList } from "@/api/category";
import "./index.less";

const { Meta } = Card;

interface Category {
  id: number;
  categoryName: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  // 倒计时状态：days/hours/minutes/seconds
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 倒计时逻辑（固定 3 天，可改成从接口获取结束时间）
  useEffect(() => {
    const deadline = Date.now() + 3 * 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(deadline - now, 0);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 请求接口--分类
  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const flashSales: Product[] = [
    {
      id: 1,
      name: "HAVIT HV-G92 Gamepad",
      price: 120,
      originalPrice: 160,
      discount: 40,
      rating: 5,
      reviews: 88,
      image:
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "AK-900 Wired Keyboard",
      price: 960,
      originalPrice: 1160,
      discount: 35,
      rating: 4,
      reviews: 75,
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      name: "IPS LCD Gaming Monitor",
      price: 370,
      originalPrice: 400,
      discount: 30,
      rating: 5,
      reviews: 99,
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      name: "S-Series Comfort Chair",
      price: 375,
      originalPrice: 400,
      discount: 25,
      rating: 4.5,
      reviews: 99,
      image:
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=300&h=300&fit=crop",
    },
  ];

  const bestSelling: Product[] = [
    {
      id: 5,
      name: "The north coat",
      price: 260,
      originalPrice: 360,
      rating: 5,
      reviews: 65,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Gucci duffle bag",
      price: 960,
      originalPrice: 1160,
      rating: 4.5,
      reviews: 65,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop",
    },
    {
      id: 7,
      name: "RGB liquid CPU Cooler",
      price: 160,
      originalPrice: 170,
      rating: 4.5,
      reviews: 65,
      image:
        "https://images.unsplash.com/photo-1591238868585-1a8b0ac9d44f?w=300&h=300&fit=crop",
    },
    {
      id: 8,
      name: "Small BookSelf",
      price: 360,
      rating: 5,
      reviews: 65,
      image:
        "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=300&h=300&fit=crop",
    },
  ];

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card
      className="product-card"
      cover={
        <div className="product-image-wrapper">
          {product.discount && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
          <div className="product-actions">
            <Button
              shape="circle"
              icon={<HeartOutlined />}
            />
            <Button
              shape="circle"
              icon={<EyeOutlined />}
            />
          </div>
          <img
            alt={product.name}
            src={product.image}
            className="product-image"
          />
          <div className="add-to-cart-overlay">
            <Button
              type="primary"
              block
            >
              {t("product.add_to_cart")}
            </Button>
          </div>
        </div>
      }
    >
      <Meta
        title={<Link to={`/product/${product.id}`}>{product.name}</Link>}
        description={
          <Space
            direction="vertical"
            size={4}
            style={{ width: "100%" }}
          >
            <Space>
              <span className="price">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
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
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <Row gutter={32}>
            <Col
              xs={0}
              md={6}
            >
              <div
                className="category-menu"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: "10px",
                }}
              >
                {categories.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      width: "calc(33.333% - 7px)",
                      textAlign: "center",
                      padding: "6px 0",
                    }}
                  >
                    <Link to="/products">{c.categoryName}</Link>
                  </div>
                ))}
              </div>
            </Col>

            {/* Hero Carousel */}
            <Col
              xs={24}
              md={18}
            >
              <Carousel
                autoplay
                className="hero-carousel"
              >
                <div className="hero-slide">
                  <div className="hero-content">
                    <Space
                      direction="vertical"
                      size={24}
                    >
                      <div className="hero-brand">
                        <div className="brand-icon" />
                        <span>iPhone 14 Series</span>
                      </div>
                      <h1 className="hero-title">
                        Up to 10%
                        <br />
                        off Voucher
                      </h1>
                      <Link
                        to="/products"
                        className="hero-cta"
                      >
                        {t("header.shop_now")} <ArrowRightOutlined />
                      </Link>
                    </Space>
                  </div>
                  <div className="hero-image">
                    <img
                      src={heroEndframe}
                      alt="Summer Collection"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </div>

                <div className="hero-slide">
                  <div className="hero-content">
                    <Space
                      direction="vertical"
                      size={24}
                    >
                      <div className="hero-brand">
                        <div className="brand-icon" />
                        <span>Summer Collection</span>
                      </div>
                      <h1 className="hero-title">
                        New Arrivals
                        <br />
                        Now Available
                      </h1>
                      <Link
                        to="/products"
                        className="hero-cta"
                      >
                        {t("header.shop_now")} <ArrowRightOutlined />
                      </Link>
                    </Space>
                  </div>
                  <div className="hero-image">
                    <img
                      src={heroEndframe}
                      alt="Summer Collection"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </div>

                <div className="hero-slide">
                  <div className="hero-content">
                    <Space
                      direction="vertical"
                      size={24}
                    >
                      <div className="hero-brand">
                        <div className="brand-icon" />
                        <span>Premium Deals</span>
                      </div>
                      <h1 className="hero-title">
                        Exclusive
                        <br />
                        Discounts
                      </h1>
                      <Link
                        to="/products"
                        className="hero-cta"
                      >
                        {t("header.shop_now")} <ArrowRightOutlined />
                      </Link>
                    </Space>
                  </div>
                  <div className="hero-image">
                    <img
                      src={heroEndframe}
                      alt="Summer Collection"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </div>
              </Carousel>
            </Col>
          </Row>
        </div>
      </div>

      {/* Flash Sales */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <div className="tag-indicator" />
              <span>{t("home.today")}</span>
            </div>
            <div
              className="section-title-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 172 }}>
                <h2 className="section-title">{t("home.flash_sales")}</h2>
                {/* 修复后的倒计时 */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Days */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>Days</div>
                    <div
                      style={{ fontSize: 40, fontWeight: 700, color: "#000" }}
                    >
                      {String(countdown.days).padStart(2, "0")}
                    </div>
                  </div>
                  {/* 红色分隔点 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#db4444",
                      }}
                    ></div>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#db4444",
                      }}
                    ></div>
                  </div>
                  {/* Hours */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>Hours</div>
                    <div
                      style={{ fontSize: 40, fontWeight: 700, color: "#000" }}
                    >
                      {String(countdown.hours).padStart(2, "0")}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#db4444",
                      }}
                    ></div>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#db4444",
                      }}
                    ></div>
                  </div>
                  {/* Minutes */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>Minutes</div>
                    <div
                      style={{ fontSize: 40, fontWeight: 700, color: "#000" }}
                    >
                      {String(countdown.minutes).padStart(2, "0")}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#db4444",
                      }}
                    ></div>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#db4444",
                      }}
                    ></div>
                  </div>
                  {/* Seconds */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>Seconds</div>
                    <div
                      style={{ fontSize: 40, fontWeight: 700, color: "#000" }}
                    >
                      {String(countdown.seconds).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>
              <Space>
                <Button
                  shape="circle"
                  icon={<LeftOutlined />}
                />
                <Button
                  shape="circle"
                  icon={<RightOutlined />}
                />
              </Space>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {flashSales.map((product) => (
              <Col
                key={product.id}
                xs={24}
                sm={12}
                md={6}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          <div className="section-footer">
            <Link to="/products">
              <Button
                type="primary"
                size="large"
              >
                {t("home.view_all")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <div className="tag-indicator" />
              <span>{t("home.this_month")}</span>
            </div>
            <div className="section-title-row">
              <h2 className="section-title">{t("home.best_selling")}</h2>
              <Link to="/products">
                <Button type="primary">{t("home.view_all")}</Button>
              </Link>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {bestSelling.map((product) => (
              <Col
                key={product.id}
                xs={24}
                sm={12}
                md={6}
              >
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <p className="banner-category">Categories</p>
              <h2 className="banner-title">{t("home.enhance_music")}</h2>
              <Button
                type="primary"
                size="large"
              >
                {t("home.buy_now")}
              </Button>
            </div>
            <div className="banner-image">
              <div className="banner-placeholder">Speaker Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <div className="container">
          <Row gutter={[48, 48]}>
            <Col
              xs={24}
              md={8}
            >
              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-circle">
                    <div className="icon-inner" />
                  </div>
                </div>
                <h3 className="service-title">{t("services.free_delivery")}</h3>
                <p className="service-desc">
                  {t("services.free_delivery_desc")}
                </p>
              </div>
            </Col>
            <Col
              xs={24}
              md={8}
            >
              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-circle">
                    <div className="icon-inner" />
                  </div>
                </div>
                <h3 className="service-title">
                  {t("services.customer_service")}
                </h3>
                <p className="service-desc">
                  {t("services.customer_service_desc")}
                </p>
              </div>
            </Col>
            <Col
              xs={24}
              md={8}
            >
              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-circle">
                    <div className="icon-inner" />
                  </div>
                </div>
                <h3 className="service-title">{t("services.money_back")}</h3>
                <p className="service-desc">{t("services.money_back_desc")}</p>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Home;
