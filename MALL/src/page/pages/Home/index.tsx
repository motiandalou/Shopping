import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Rate, Space, Carousel, Spin } from "antd";
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
import { getBestSellingList, getFlashHomeData } from "@/api/home";
import "./index.less";

const { Meta } = Card;

interface Category {
  id: number;
  categoryName: string;
}

interface Product {
  id: number;
  goodsName: string;
  flashPrice: number;
  originPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  coverImg: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashSales, setFlashSales] = useState<Product[]>([]);
  const [bestSelling, setBestSelling] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const totalSecondRef = useRef<number>(0);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  // 活动状态秒数
  const [activitySec, setActivitySec] = useState(0);

  // 分页配置 每页4个
  const pageSize = 4;
  // 秒杀分页
  const [flashPage, setFlashPage] = useState(0);
  const currentFlashList = flashSales.slice(
    flashPage * pageSize,
    (flashPage + 1) * pageSize,
  );
  const flashHasPrev = flashPage > 0;
  const flashHasNext = (flashPage + 1) * pageSize < flashSales.length;
  // 热销分页
  const [bestPage, setBestPage] = useState(0);
  const currentBestList = bestSelling.slice(
    bestPage * pageSize,
    (bestPage + 1) * pageSize,
  );
  const bestHasPrev = bestPage > 0;
  const bestHasNext = (bestPage + 1) * pageSize < bestSelling.length;

  // 倒计时定时器
  useEffect(() => {
    // 1. 本地每秒倒计时UI
    const countTimer = setInterval(() => {
      let sec = totalSecondRef.current;
      if (sec <= 0) {
        clearInterval(countTimer);
        return;
      }
      sec -= 1;
      totalSecondRef.current = sec;
      const days = Math.floor(sec / (24 * 60 * 60));
      const hours = Math.floor((sec % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((sec % (60 * 60)) / 60);
      const seconds = sec % 60;
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    // 2. 每30秒同步后端真实剩余秒数
    const syncTimer = setInterval(async () => {
      try {
        const res = await getFlashHomeData();
        const realSec = res.data.remainTotalSeconds ?? 0;
        totalSecondRef.current = realSec;
        setActivitySec(realSec);
      } catch (e) {
        console.warn("同步秒杀倒计时失败", e);
      }
    }, 30000);

    return () => {
      clearInterval(countTimer);
      clearInterval(syncTimer);
    };
  }, []);

  // 初始化加载所有数据
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const categoryRes = await getCategoryList();
        setCategories(categoryRes.data);

        const flashHomeRes = await getFlashHomeData();
        const homeData = flashHomeRes.data;
        setFlashSales(homeData.goodsList || []);
        const realSec = homeData.remainTotalSeconds ?? 0;
        totalSecondRef.current = realSec;
        setActivitySec(realSec);

        // const bestRes = await getBestSellingList();
        // setBestSelling(bestRes.data.list || []);
      } catch (err) {
        console.error("首页数据加载失败", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

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
            alt={product.goodsName}
            src={product.coverImg}
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
        title={<Link to={`/product/${product.id}`}>{product.goodsName}</Link>}
        description={
          <Space
            direction="vertical"
            size={4}
            style={{ width: "100%" }}
          >
            <Space>
              <span className="price">¥{product.flashPrice}</span>
              {product.originPrice && (
                <span className="original-price">¥{product.originPrice}</span>
              )}
            </Space>
            <Space>
              <Rate
                disabled
                value={product.rating}
                style={{ fontSize: 14 }}
              />
              <span className="reviews">({product.reviewCount})</span>
            </Space>
          </Space>
        }
      />
    </Card>
  );

  return (
    <div className="home-page">
      <Spin
        spinning={loading}
        size="large"
        tip={t("common.loading")}
      >
        {/* Hero */}
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

        {/* 限时秒杀区域 */}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: 172 }}
                >
                  <h2 className="section-title">{t("home.flash_sales")}</h2>

                  {activitySec > 0 ? (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>
                          Days
                        </div>
                        <div
                          style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: "#000",
                          }}
                        >
                          {String(countdown.days).padStart(2, "0")}
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
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>
                          Hours
                        </div>
                        <div
                          style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: "#000",
                          }}
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
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>
                          Minutes
                        </div>
                        <div
                          style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: "#000",
                          }}
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
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, marginBottom: 4 }}>
                          Seconds
                        </div>
                        <div
                          style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: "#000",
                          }}
                        >
                          {String(countdown.seconds).padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: "bold",
                        color: "#999",
                      }}
                    >
                      The event has not yet started / Ended
                    </div>
                  )}
                </div>
                {/* 秒杀分页按钮 */}
                <Space>
                  <Button
                    shape="circle"
                    icon={<LeftOutlined />}
                    disabled={!flashHasPrev}
                    onClick={() => setFlashPage((p) => p - 1)}
                  />
                  <Button
                    shape="circle"
                    icon={<RightOutlined />}
                    disabled={!flashHasNext}
                    onClick={() => setFlashPage((p) => p + 1)}
                  />
                </Space>
              </div>
            </div>
            {/* 秒杀当前页商品 */}
            <Row gutter={[24, 24]}>
              {currentFlashList.map((product) => (
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

        {/* 热销商品（新增分页按钮） */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">
                <div className="tag-indicator" />
                <span>{t("home.this_month")}</span>
              </div>
              <div
                className="section-title-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2 className="section-title">{t("home.best_selling")}</h2>
                {/* 热销分页按钮 */}
                <Space>
                  <Button
                    shape="circle"
                    icon={<LeftOutlined />}
                    disabled={!bestHasPrev}
                    onClick={() => setBestPage((p) => p - 1)}
                  />
                  <Button
                    shape="circle"
                    icon={<RightOutlined />}
                    disabled={!bestHasNext}
                    onClick={() => setBestPage((p) => p + 1)}
                  />
                  <Link to="/products">
                    <Button type="primary">{t("home.view_all")}</Button>
                  </Link>
                </Space>
              </div>
            </div>
            {/* 热销当前页商品 */}
            <Row gutter={[24, 24]}>
              {currentBestList.map((product) => (
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

        {/* 广告横幅 */}
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

        {/* 服务保障区域 */}
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
                  <h3 className="service-title">
                    {t("services.free_delivery")}
                  </h3>
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
                  <p className="service-desc">
                    {t("services.money_back_desc")}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      </Spin>
    </div>
  );
};

export default Home;
