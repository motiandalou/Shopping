import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Statistic, Breadcrumb, Space } from "antd";
import {
  ShopOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  TruckOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import "./index.less";
import side_image from "@/page/assets/image/Side_Image.png";
import Frame_874 from "@/page/assets/image/Frame_874.png";
import Frame_875 from "@/page/assets/image/Frame_875.png";
import Frame_876 from "@/page/assets/image/Frame_876.png";

const About: React.FC = () => {
  const stats = [
    {
      icon: <ShopOutlined />,
      value: "10.5k",
      title: "Sallers active our site",
    },
    {
      icon: <DollarOutlined />,
      value: "33k",
      title: "Monthly Product Sale",
      highlighted: true,
    },
    {
      icon: <ShoppingOutlined />,
      value: "45.5k",
      title: "Customer active in our site",
    },
    {
      icon: <DollarOutlined />,
      value: "25k",
      title: "Annual gross sale in our site",
    },
  ];

  const team = [
    {
      name: "Tom Cruise",
      position: "Founder & Chairman",
      image: Frame_874,
    },
    {
      name: "Emma Watson",
      position: "Managing Director",
      image: Frame_875,
    },
    {
      name: "Will Smith",
      position: "Product Designer",
      image: Frame_876,
    },
  ];

  return (
    <div className="about-page">
      <div className="container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>About</Breadcrumb.Item>
        </Breadcrumb>

        {/* Our Story */}
        <Row
          gutter={48}
          align="middle"
          className="story-section"
        >
          <Col
            xs={24}
            md={12}
          >
            <h1 className="section-title">Our Story</h1>
            <Space
              direction="vertical"
              size={16}
            >
              <p className="story-text">
                Launched in 2015, MALL is South Asia's premier online shopping
                marketplace with an active presence in Bangladesh. Supported by
                wide range of tailored marketing, data and service solutions,
                MALL has 10,500 sallers and 300 brands and serves 3 millions
                customers across the region.
              </p>
              <p className="story-text">
                MALL has more than 1 Million products to offer, growing at a
                very fast pace. MALL offers a diverse assortment in categories
                ranging from consumer.
              </p>
            </Space>
          </Col>
          <Col
            xs={24}
            md={12}
          >
            <div className="story-image">
              <img
                src={side_image}
                alt="Shopping"
              />
            </div>
          </Col>
        </Row>

        {/* Stats */}
        <Row
          gutter={[24, 24]}
          className="stats-section"
        >
          {stats.map((stat, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={6}
            >
              <Card
                className={`stat-card ${stat.highlighted ? "highlighted" : ""}`}
              >
                <div className="stat-icon">{stat.icon}</div>
                <Statistic value={stat.value} />
                <p className="stat-title">{stat.title}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Team */}
        <Row
          gutter={[32, 32]}
          className="team-section"
        >
          {team.map((member, index) => (
            <Col
              key={index}
              xs={24}
              md={8}
            >
              <div className="team-member">
                <div className="member-image">
                  <img
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-position">{member.position}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* Services */}
        <Row
          gutter={[48, 48]}
          className="services-section"
        >
          <Col
            xs={24}
            md={8}
          >
            <div className="service-item">
              <div className="service-icon">
                <TruckOutlined />
              </div>
              <h3>FREE AND FAST DELIVERY</h3>
              <p>Free delivery for all orders over $140</p>
            </div>
          </Col>
          <Col
            xs={24}
            md={8}
          >
            <div className="service-item">
              <div className="service-icon">
                <CustomerServiceOutlined />
              </div>
              <h3>24/7 CUSTOMER SERVICE</h3>
              <p>Friendly 24/7 customer support</p>
            </div>
          </Col>
          <Col
            xs={24}
            md={8}
          >
            <div className="service-item">
              <div className="service-icon">
                <SafetyOutlined />
              </div>
              <h3>MONEY BACK GUARANTEE</h3>
              <p>We return money within 30 days</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default About;
