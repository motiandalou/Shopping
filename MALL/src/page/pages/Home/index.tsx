import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Rate, Space, Carousel, Spin } from "antd";
import {
  ArrowRightOutlined,
  HeartOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  TruckOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  MonitorOutlined,
  ScheduleOutlined,
  CameraOutlined,
  AudioOutlined,
  PlaySquareOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getCategoryList } from "@/api/category";
import { getBestSellingList, getFlashHomeData } from "@/api/home";
import "./index.less";
import volume1 from "@/page/assets/image/volume1.png";
import newArrivalRightBottomLeft from "@/page/assets/image/newArrivalRightBottomLeft.png";
import newArrivalRightBottomRight from "@/page/assets/image/newArrivalRightBottomRight.png";
import newArrivalRightTop from "@/page/assets/image/newArrivalRightTop.png";
import newArrivalLeftBig from "@/page/assets/image/newArrivalLeftBig.png";
import heroEndframe from "@/page/assets/image/hero_endframe__cvklg0xk3w6e_large 2.png";
import apple_log from "@/page/assets/image/apple_log.png";

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
  discountRate?: number;
  rating: number;
  reviewCount: number;
  coverImg: string;
}

// New Arrival
interface NewArrivalItem {
  title: string;
  desc?: string;
  img: string;
}
const newArrivalList: {
  leftBig: NewArrivalItem;
  rightTop: NewArrivalItem;
  rightBottom: NewArrivalItem[];
} = {
  leftBig: {
    title: "PlayStation 5",
    desc: "Black and White version of the PS5 coming out on sale.",
    img: newArrivalLeftBig,
  },
  rightTop: {
    title: "Women's Collections",
    desc: "Featured woman collections that give you another vibe.",
    img: newArrivalRightTop,
  },
  rightBottom: [
    {
      title: "Speakers",
      desc: "Amazon wireless speakers",
      img: newArrivalRightBottomLeft,
    },
    {
      title: "Perfume",
      desc: "GUCCI INTENSE OUD EDP",
      img: newArrivalRightBottomRight,
    },
  ],
};

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

  // 分类模块状态
  const [activeCat, setActiveCat] = useState<string>("camera");
  const [catScrollX, setCatScrollX] = useState<number>(0);
  const categoryIconList = [
    {
      name: "Phones",
      icon: <MobileOutlined size={32} />,
      key: "phones",
    },
    {
      name: "Computers",
      icon: <MonitorOutlined size={32} />,
      key: "computers",
    },
    {
      name: "SmartWatch",
      icon: <ScheduleOutlined size={32} />,
      key: "watch",
    },
    {
      name: "Camera",
      icon: <CameraOutlined size={32} />,
      key: "camera",
    },
    {
      name: "HeadPhones",
      icon: <AudioOutlined size={32} />,
      key: "headphone",
    },
    {
      name: "Gaming",
      icon: <PlaySquareOutlined size={32} />,
      key: "gaming",
    },
  ];

  const scrollCatLeft = () => setCatScrollX((prev) => Math.max(prev - 220, 0));
  const scrollCatRight = () => setCatScrollX((prev) => prev + 220);

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

  // Our Products
  const [productPage, setProductPage] = useState(0);
  const currentProductList = bestSelling.slice(
    productPage * pageSize,
    (productPage + 1) * pageSize,
  );
  const productHasPrev = productPage > 0;
  const productHasNext = (productPage + 1) * pageSize < bestSelling.length;

  // 倒计时定时器
  useEffect(() => {
    // 本地每秒倒计时UI
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

    // 每30秒同步后端真实剩余秒数
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
          {product.discountRate && (
            <div className="discount-badge">-{product.discountRate}%</div>
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

  // 新品格子卡片组件
  const NewArrivalBox: React.FC<{ item: NewArrivalItem; big?: boolean }> = ({
    item,
    big,
  }) => (
    <div
      style={{
        width: "100%",
        height: big ? 420 : 200,
        background: "#000",
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={item.img}
        alt={item.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0, fontSize: big ? 32 : 22, fontWeight: 600 }}>
          {item.title}
        </h3>
        {item.desc && (
          <p style={{ margin: 0, opacity: 0.8, maxWidth: big ? 300 : 220 }}>
            {item.desc}
          </p>
        )}
        <Link
          to="/products"
          style={{
            color: "#fff",
            textDecoration: "none",
            borderBottom: "1px solid #fff",
            width: "fit-content",
            paddingBottom: 2,
          }}
        >
          Shop Now
        </Link>
      </div>
    </div>
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
                          <img
                            className="brand-icon"
                            src={apple_log}
                            alt="logo"
                          />
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
                          <img
                            className="brand-icon"
                            src={apple_log}
                            alt="logo"
                          />
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
                          <img
                            className="brand-icon"
                            src={apple_log}
                            alt="logo"
                          />
                          <span>Premium Deals</span>
                        </div>
                        <h1 className="hero-title">
                          MALL
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
                  <div className="hero-slide">
                    <div className="hero-content">
                      <Space
                        direction="vertical"
                        size={24}
                      >
                        <div className="hero-brand">
                          <img
                            className="brand-icon"
                            src={apple_log}
                            alt="logo"
                          />
                          <span>Premium Deals</span>
                        </div>
                        <h1 className="hero-title">
                          MALL
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
                  <div className="hero-slide">
                    <div className="hero-content">
                      <Space
                        direction="vertical"
                        size={24}
                      >
                        <div className="hero-brand">
                          <img
                            className="brand-icon"
                            src={apple_log}
                            alt="logo"
                          />
                          <span>Premium Deals</span>
                        </div>
                        <h1 className="hero-title">
                          MALL
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

        {/* Browse By Category */}
        <section className="section">
          <div className="container">
            <div
              className="section-header"
              style={{
                borderBottom: "1px solid #E0E0E0",
              }}
            >
              <div
                className="section-tag"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  className="tag-indicator"
                  style={{
                    width: 12,
                    height: 32,
                    background: "#DB4444",
                    borderRadius: 4,
                  }}
                />
                <span style={{ color: "#DB4444", fontWeight: 500 }}>
                  {t("Categories")}
                </span>
              </div>
              <div
                className="section-title-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <h2
                  className="section-title"
                  style={{ fontSize: 48, fontWeight: 600, margin: 0 }}
                >
                  {t("Browse By Category")}
                </h2>
                {/* 分类滑动左右箭头按钮 */}
                <Space size={12}>
                  <Button
                    shape="circle"
                    icon={<LeftOutlined />}
                    onClick={scrollCatLeft}
                    style={{
                      width: 44,
                      height: 44,
                      border: "none",
                      background: "#F5F5F5",
                    }}
                  />
                  <Button
                    shape="circle"
                    icon={<RightOutlined />}
                    onClick={scrollCatRight}
                    style={{
                      width: 44,
                      height: 44,
                      border: "none",
                      background: "#F5F5F5",
                    }}
                  />
                </Space>
              </div>
              {/* 横向滚动分类卡片容器 */}
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  marginBottom: 32,
                  paddingBottom: 8,
                  boxSizing: "border-box",
                  touchAction: "pan-x",
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 30,
                    transform: `translateX(-${catScrollX}px)`,
                    transition: "transform 0.3s ease",
                    width: "max-content",
                  }}
                >
                  {categoryIconList.map((cat) => (
                    <div
                      key={cat.key}
                      onClick={() => setActiveCat(cat.key)}
                      style={{
                        width: 170,
                        height: 145,
                        border:
                          activeCat === cat.key ? "none" : "1px solid #E0E0E0",
                        background: activeCat === cat.key ? "#DB4444" : "#fff",
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* 图标 */}
                      <span
                        style={{
                          color: activeCat === cat.key ? "#fff" : "#000",
                          fontSize: 50,
                        }}
                      >
                        {cat.icon}
                      </span>
                      {/* 分类文字 */}
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 500,
                          color: activeCat === cat.key ? "#fff" : "#000",
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

        {/* Best Selling */}
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
                    {/* <Button type="primary">{t("home.view_all")}</Button> */}
                  </Link>
                </Space>
              </div>
            </div>
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

        {/* Banner */}
        <section className="promo-banner">
          <div className="container">
            <div className="banner-content">
              <div className="banner-text">
                <p className="banner-category">Categories</p>
                <h2 className="banner-title">{t("home.enhance_music")}</h2>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: "#00FF66",
                  }}
                >
                  {t("home.buy_now")}
                </Button>
              </div>
              <div className="banner-image">
                <img
                  className="banner-placeholder"
                  src={volume1}
                  alt="Speaker Image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div
                className="section-tag"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  className="tag-indicator"
                  style={{
                    width: 12,
                    height: 32,
                    background: "#DB4444",
                    borderRadius: 4,
                  }}
                />
                <span style={{ color: "#DB4444", fontWeight: 500 }}>
                  {t("Our Products")}
                </span>
              </div>
              <div
                className="section-title-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <h2
                  className="section-title"
                  style={{ fontSize: 48, fontWeight: 600, margin: 0 }}
                >
                  {t("Explore Our Products")}
                </h2>
                {/* 独立翻页箭头 */}
                <Space size={12}>
                  <Button
                    shape="circle"
                    icon={<LeftOutlined />}
                    disabled={!productHasPrev}
                    onClick={() => setProductPage((p) => p - 1)}
                    style={{
                      width: 44,
                      height: 44,
                      border: "none",
                      background: "#F5F5F5",
                    }}
                  />
                  <Button
                    shape="circle"
                    icon={<RightOutlined />}
                    disabled={!productHasNext}
                    onClick={() => setProductPage((p) => p + 1)}
                    style={{
                      width: 44,
                      height: 44,
                      border: "none",
                      background: "#F5F5F5",
                    }}
                  />
                </Space>
              </div>
            </div>
            {/* 商品卡片行 */}
            <Row gutter={[24, 24]}>
              {currentProductList.map((product) => (
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
            {/* 底部居中红色View All按钮，匹配截图 */}
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link to="/products">
                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: "#DB4444",
                    borderColor: "#DB4444",
                    padding: "0 40px",
                    height: 56,
                    fontSize: 16,
                  }}
                >
                  {t("home.view_all")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* New Arrival  */}
        <section className="section">
          <div className="container">
            <div
              className="section-header"
              style={{ marginBottom: 32 }}
            >
              <div
                className="section-tag"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  className="tag-indicator"
                  style={{
                    width: 12,
                    height: 32,
                    background: "#DB4444",
                    borderRadius: 4,
                  }}
                />
                <span style={{ color: "#DB4444", fontWeight: 500 }}>
                  Featured
                </span>
              </div>
              <h2
                className="section-title"
                style={{ fontSize: 48, fontWeight: 600, margin: 0 }}
              >
                New Arrival
              </h2>
            </div>
            {/* 网格布局：左侧大卡片 + 右侧上下两格 */}
            <Row gutter={24}>
              <Col
                xs={24}
                lg={12}
              >
                <NewArrivalBox
                  item={newArrivalList.leftBig}
                  big
                />
              </Col>
              <Col
                xs={24}
                lg={12}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  <NewArrivalBox item={newArrivalList.rightTop} />
                  <Row gutter={24}>
                    <Col xs={12}>
                      <NewArrivalBox item={newArrivalList.rightBottom[0]} />
                    </Col>
                    <Col xs={12}>
                      <NewArrivalBox item={newArrivalList.rightBottom[1]} />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
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
                      <div className="icon-inner">
                        <TruckOutlined />
                      </div>
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
                      <div className="icon-inner">
                        <CustomerServiceOutlined />
                      </div>
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
                      <div className="icon-inner">
                        <SafetyCertificateOutlined />
                      </div>
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
