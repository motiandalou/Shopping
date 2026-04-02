import React from "react";
import { Row, Col, Card, Button, message, Carousel } from "antd";
import { FireOutlined } from "@ant-design/icons";
import "../../App.css";

// 京东风格商品数据（和你截图一致）
const products = [
  {
    id: 1,
    name: "凡士林身体乳,滋润保湿夏季补水全身学生用持久留香秋冬大容量 1瓶装【限量福利】",
    price: 9.9,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/304169/24/13773/157589/685caebdFba5a6fb3/29797a82464360a8.jpg.avif",
    category: "美妆个护",
  },
  {
    id: 2,
    name: "Apple/苹果 AirPods 4 搭配USB-C充电盒 苹果耳机 蓝牙耳机 适用iPhone/iPad/Mac",
    price: 828,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
    category: "手机数码",
  },
  {
    id: 3,
    name: "嘉丹纳【镭射贝母纹】适用华为mate70pro手机壳mate70新款渐变炫彩matr70pro+",
    price: 27.9,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
    category: "手机数码",
  },
  {
    id: 4,
    name: "和风雨凡士林身体乳男士专用身体乳清爽不油腻保湿滋润秋冬清爽身体乳",
    price: 12.9,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
    category: "美妆个护",
  },
  {
    id: 5,
    name: "DRVIALY身体乳持久留香72小时香体女保湿滋润秋冬补水全身嫩白去鸡皮",
    price: 89,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
    category: "美妆个护",
  },
  {
    id: 6,
    name: "小米14 徕卡光学Summilux镜头 光影猎人900 澎湃OS 8+256GB 雪山粉 小米手机",
    price: 3999,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
    category: "手机数码",
  },
];

// 轮播图数据
const bannerList = [
  {
    id: 1,
    url: "https://img1.360buyimg.com/da/jfs/t1/305626/20/20904/20259/6889214eFd736b63a/0b04cfdd514fa13e.png",
  },
  {
    id: 2,
    url: "https://imgcps.jd.com/ling-cubic/turing/focusChannelPcText/2554a736028c9090f738d0806fc06634/cr/s/q70.png",
  },
  {
    id: 3,
    url: "https://img1.360buyimg.com/da/jfs/t1/335080/14/21580/30181/68e939c6Fce244551/cbadad1f4ab66331.png",
  },
];

// 秒杀商品
const seckillProducts = [
  {
    id: 7,
    name: "一次性口罩 独立包装 三层防护",
    price: 18.22,
    originalPrice: 39.9,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
  },
  {
    id: 8,
    name: "凡士林身体乳 大容量家庭装",
    price: 27.9,
    originalPrice: 59.9,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
  },
  {
    id: 9,
    name: "无线蓝牙耳机 降噪款",
    price: 26.9,
    originalPrice: 99.9,
    pic: "https://img10.360buyimg.com/pcpubliccms/s228x228_jfs/t1/409834/31/14984/97892/69ca5259F0c30aa7c/00835dc5dc754f1e.png.avif",
  },
];

export default function ProductList() {
  const addCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((i) => i.id === item.id);

    if (idx > -1) {
      cart[idx].num += 1;
    } else {
      cart.push({ ...item, num: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    message.success("加入购物车成功");
  };

  return (
    <div>
      {/* 轮播Banner */}
      <Carousel
        autoplay
        className="jd-banner"
      >
        {bannerList.map((banner) => (
          <div key={banner.id}>
            <img
              src={banner.url}
              alt="banner"
            />
          </div>
        ))}
      </Carousel>

      {/* 秒杀专区 */}
      <div className="jd-seckill">
        <div className="jd-seckill-title">
          <FireOutlined /> 京东秒杀
        </div>
        <Row gutter={[20, 20]}>
          {seckillProducts.map((item) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              key={item.id}
            >
              <div className="jd-product-card">
                <img
                  src={item.pic}
                  alt={item.name}
                  className="jd-product-img"
                />
                <div className="jd-product-info">
                  <div className="jd-product-name">{item.name}</div>
                  <div className="jd-product-price">
                    ¥{item.price}{" "}
                    <span
                      style={{
                        fontSize: 12,
                        color: "#999",
                        textDecoration: "line-through",
                      }}
                    >
                      ¥{item.originalPrice}
                    </span>
                  </div>
                  <button
                    className="jd-add-cart-btn"
                    onClick={() => addCart(item)}
                  >
                    立即抢购
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 热门商品区 */}
      <h2
        style={{
          marginBottom: 20,
          fontSize: 24,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        热门商品
      </h2>
      <Row gutter={[20, 20]}>
        {products.map((item) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            key={item.id}
          >
            <div className="jd-product-card">
              <img
                src={item.pic}
                alt={item.name}
                className="jd-product-img"
              />
              <div className="jd-product-info">
                <div className="jd-product-name">{item.name}</div>
                <div className="jd-product-price">¥{item.price}</div>
                <button
                  className="jd-add-cart-btn"
                  onClick={() => addCart(item)}
                >
                  加入购物车
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
