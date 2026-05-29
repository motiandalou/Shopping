import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Rate,
  Space,
  Select,
  Slider,
  Checkbox,
  Breadcrumb,
  Pagination,
  message,
} from "antd";
import { HeartOutlined, EyeOutlined, FilterOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./index.less";
import { addCart } from "../../../api/cart";
import { getGoodsList } from "@/api/goods";
import { getCategoryList } from "@/api/category";

const { Meta } = Card;

interface Category {
  id: number;
  categoryName: string;
}

// 商品接口返回的真实字段
interface Product {
  id: number;
  goodsName: string;
  price: number;
  coverImg: string;
  categoryName: string;
  rating?: number;
  reviews?: number;
}

const Products: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  // 获取商品列表
  const fetchGoodsList = async () => {
    setLoading(true);
    try {
      const res = await getGoodsList({
        pageNum: currentPage,
        pageSize: 12,
        sortBy,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });
      if (res.code === 200) {
        setProducts(res.data);
        setTotal(res.data.length);
      } else {
        console.error(res.msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoodsList();
    fetchCategoryList();
  }, [currentPage, sortBy, priceRange]);

  // 加入购物车
  const handleAddToCart = async (product: Product) => {
    try {
      const res = await addCart({
        goodsId: product.id,
        quantity: 1,
        price: product.price,
      });
      message.success(res.msg);
    } catch (err) {
      console.log(err);
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card
      className="product-card"
      loading={loading}
      cover={
        <div className="product-image-wrapper">
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
          <div>
            <Button
              type="primary"
              block
              onClick={() => handleAddToCart(product)}
            >
              {t("product.add_to_cart")}
            </Button>
          </div>
        </div>
      }
    >
      <Meta
        // 详情界面
        title={<Link to={`/product/${product.id}`}>{product.goodsName}</Link>}
        description={
          <Space
            direction="vertical"
            size={4}
            style={{ width: "100%" }}
          >
            <div className="category-tag">{product.categoryName}</div>
            <span className="price">${product.price}</span>
            <Space>
              <Rate
                disabled
                value={product.rating || 5}
                style={{ fontSize: 14 }}
              />
              <span className="reviews">({product.reviews || 0})</span>
            </Space>
          </Space>
        }
      />
    </Card>
  );

  return (
    <div className="products-page">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">{t("nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={32}>
          {/* Filters Sidebar */}
          <Col
            xs={0}
            lg={6}
          >
            <div className="filters-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">
                  <FilterOutlined /> {t("common.filter")}
                </h3>

                {/* Categories */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Categories</h4>
                  <Space direction="vertical">
                    {categories.map((c) => (
                      <Checkbox key={c.id}>{c.categoryName}</Checkbox>
                    ))}
                  </Space>
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Price Range</h4>
                  <Slider
                    range
                    min={0}
                    max={1000}
                    value={priceRange}
                    onChange={(value) =>
                      setPriceRange(value as [number, number])
                    }
                  />
                  <div className="price-range-text">
                    ${priceRange[0]} - ${priceRange[1]}
                  </div>
                </div>

                {/* Rating */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Rating</h4>
                  <Space direction="vertical">
                    {[4, 3, 2, 1].map((rating) => (
                      <Checkbox key={rating}>
                        <Rate
                          disabled
                          value={rating}
                          style={{ fontSize: 14 }}
                        />{" "}
                        & Up
                      </Checkbox>
                    ))}
                  </Space>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                >
                  {t("common.apply")}
                </Button>
              </div>
            </div>
          </Col>

          {/* Products Grid */}
          <Col
            xs={24}
            lg={18}
          >
            {/* Sort Bar */}
            <div className="sort-bar">
              <div className="results-info">
                Showing{" "}
                <strong>
                  {(currentPage - 1) * 12 + 1}-
                  {Math.min(currentPage * 12, total)}
                </strong>{" "}
                of <strong>{total}</strong> results
              </div>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 200 }}
                options={[
                  { value: "featured", label: "Featured" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "newest", label: "Newest" },
                  { value: "rating", label: "Top Rated" },
                ]}
              />
            </div>

            {/* Products Grid */}
            <Row gutter={[24, 24]}>
              {products.map((product) => (
                <Col
                  key={product.id}
                  xs={24}
                  sm={12}
                  md={8}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="pagination-wrapper">
              <Pagination
                current={currentPage}
                onChange={setCurrentPage}
                total={total}
                pageSize={12}
                showSizeChanger={false}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Products;
