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
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./index.less";
import { addCart } from "../../../api/cart";
import { getGoodsList } from "@/api/goods";
import { getCategoryList } from "@/api/category";
import { toggleFavorite, getBatchFavoriteState } from "@/api/favorite";

const { Meta } = Card;

interface Category {
  id: number;
  categoryName: string;
}

interface Product {
  id: number;
  goodsName: string;
  price: number;
  coverImg: string;
  categoryName: string;
  rating?: number;
  reviews?: number;
  isFavorite?: boolean;
}

const Products: React.FC = () => {
  const { t } = useTranslation();
  const PAGE_SIZE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");

  // 筛选临时缓存（点击Apply才同步到查询参数）
  const [tempPrice, setTempPrice] = useState<[number, number]>([0, 1000]);
  const [tempCategoryIds, setTempCategoryIds] = useState<number[]>([]);
  const [tempRatingArr, setTempRatingArr] = useState<number[]>([]);

  // 真正用于接口请求的筛选参数
  const [queryPrice, setQueryPrice] = useState<[number, number]>([0, 1000]);
  const [queryCategoryIds, setQueryCategoryIds] = useState<number[]>([]);
  const [queryMinRating, setQueryMinRating] = useState<number | undefined>(
    undefined,
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  // 获取商品
  const fetchGoodsList = async () => {
    setLoading(true);
    try {
      const params = {
        pageDTO: {
          pageNum: currentPage,
          pageSize: PAGE_SIZE,
        },
        queryDTO: {
          categoryIdList:
            queryCategoryIds.length === categories.length
              ? undefined
              : queryCategoryIds,
          minPrice: queryPrice[0],
          maxPrice: queryPrice[1],
          minRating: queryMinRating,
          sortBy,
        },
      };
      const res = await getGoodsList(params);
      if (res.code === 200) {
        const pageData = res.data || {};
        const list = pageData.list || [];
        setTotal(pageData.total ?? 0);
        await batchGetFavoriteStatus(list);
        setProducts(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 批量收藏状态
  const batchGetFavoriteStatus = async (list: Product[]) => {
    if (!list.length) return;
    const ids = list.map((item) => item.id);
    try {
      const res = await getBatchFavoriteState(ids);
      if (res.code === 200) {
        const map = res.data || {};
        list.forEach((item) => (item.isFavorite = map[item.id] ?? false));
      }
    } catch {
      list.forEach((item) => (item.isFavorite = false));
    }
  };

  // 获取分类 + 默认全选
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      const list = res.data || [];
      setCategories(list);
      const allIds = list.map((item) => item.id);
      setTempCategoryIds(allIds);
      setQueryCategoryIds(allIds);
    } catch (err) {
      console.error(err);
    }
  };

  // 点击【Apply】确认筛选
  const handleApplyFilter = () => {
    // 把临时筛选值赋值给真正查询参数
    setQueryPrice(tempPrice);
    setQueryCategoryIds(tempCategoryIds);
    // 取勾选星级里最小的数值传给后端minRating（满足>=该星级）
    setQueryMinRating(
      tempRatingArr.length ? Math.min(...tempRatingArr) : undefined,
    );
    // 筛选重置到第一页
    setCurrentPage(1);
  };

  // 页码、排序改变自动刷新
  useEffect(() => {
    fetchGoodsList();
  }, [currentPage, sortBy, queryPrice, queryCategoryIds, queryMinRating]);

  // 页面初次加载拿分类
  useEffect(() => {
    fetchCategoryList();
  }, []);

  // 加购物车
  const handleAddToCart = async (product: Product) => {
    try {
      const res = await addCart({
        goodsId: product.id,
        quantity: 1,
        price: product.price,
      });
      message.success(res.msg);
    } catch (e) {
      console.error(e);
    }
  };

  // 收藏切换
  const handleToggleFavorite = async (goodsId: number) => {
    try {
      await toggleFavorite(goodsId);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === goodsId
            ? { ...item, isFavorite: !item.isFavorite }
            : item,
        ),
      );
      message.success("操作成功");
    } catch (e) {
      console.error(e);
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
              icon={
                product.isFavorite ? (
                  <HeartFilled style={{ color: "#f5222d" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => handleToggleFavorite(product.id)}
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

  const startNum = (currentPage - 1) * PAGE_SIZE + 1;
  const endNum = Math.min(currentPage * PAGE_SIZE, total);

  // 分类勾选临时存储（不点Apply不生效）
  const onCheckCategoryChange = (checked: boolean, id: number) => {
    let newArr: number[];
    if (checked) {
      newArr = [...tempCategoryIds, id];
    } else {
      newArr = tempCategoryIds.filter((item) => item !== id);
    }
    setTempCategoryIds(newArr);
  };

  // 星级勾选临时存储
  const onCheckRatingChange = (checked: boolean, val: number) => {
    let newArr: number[];
    if (checked) {
      newArr = [...tempRatingArr, val];
    } else {
      newArr = tempRatingArr.filter((item) => item !== val);
    }
    setTempRatingArr(newArr);
  };

  return (
    <div className="products-page">
      <div className="container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">{t("nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={32}>
          {/* 左侧筛选栏 */}
          <Col
            xs={0}
            lg={6}
          >
            <div className="filters-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">
                  <FilterOutlined /> {t("common.filter")}
                </h3>

                {/* 分类多选区域 */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Categories</h4>
                  <Space direction="vertical">
                    {categories.map((c) => (
                      <Checkbox
                        key={c.id}
                        checked={tempCategoryIds.includes(c.id)}
                        onChange={(e) =>
                          onCheckCategoryChange(e.target.checked, c.id)
                        }
                      >
                        {c.categoryName}
                      </Checkbox>
                    ))}
                  </Space>
                </div>

                {/* 价格区间（临时值） */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Price Range</h4>
                  <Slider
                    range
                    min={0}
                    max={1000}
                    value={tempPrice}
                    onChange={(v) => setTempPrice(v as [number, number])}
                  />
                  <div className="price-range-text">
                    ${tempPrice[0]} - ${tempPrice[1]}
                  </div>
                </div>

                {/* 星级筛选 */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Rating</h4>
                  <Space direction="vertical">
                    {[4, 3, 2, 1].map((r) => (
                      <Checkbox
                        key={r}
                        checked={tempRatingArr.includes(r)}
                        onChange={(e) =>
                          onCheckRatingChange(e.target.checked, r)
                        }
                      >
                        <Rate
                          disabled
                          value={r}
                          style={{ fontSize: 14 }}
                        />{" "}
                        & Up
                      </Checkbox>
                    ))}
                  </Space>
                </div>

                {/* 点击确认筛选 */}
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleApplyFilter}
                >
                  {t("common.apply")}
                </Button>
              </div>
            </div>
          </Col>

          {/* 右侧商品 */}
          <Col
            xs={24}
            lg={18}
          >
            <div className="sort-bar">
              <div className="results-info">
                Showing{" "}
                <strong>
                  {startNum}-{endNum}
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

            <Row gutter={[24, 24]}>
              {products.map((p) => (
                <Col
                  key={p.id}
                  xs={24}
                  sm={12}
                  md={8}
                >
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>

            <div
              className="pagination-wrapper"
              style={{ marginTop: 30 }}
            >
              <Pagination
                current={currentPage}
                onChange={setCurrentPage}
                total={total}
                pageSize={PAGE_SIZE}
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
