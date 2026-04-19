import { useState, useEffect, useRef } from "react";
import {
  Table,
  Card,
  Form,
  Input,
  Modal,
  message,
  Space,
  Popconfirm,
  Pagination,
  Select,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getGoodsList,
  addGoods,
  updateGoods,
  deleteGoods,
} from "../../api/goods";
import { getCategoryList } from "../../api/category";
import ShoppingButton from "../../components/shopping_button";
import ShoppingState from "../../components/Shopping_state";
import { useTranslation } from "react-i18next";

export default function GoodsManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [goodsList, setGoodsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentGoods, setCurrentGoods] = useState(null);

  // 分页状态
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 分类滚动加载
  const [categoryPage, setCategoryPage] = useState(1);
  const [showLoading, setShowLoading] = useState(false);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const CATEGORY_PAGE_SIZE = 10;
  const isLoadingRef = useRef(false);

  useEffect(() => {
    fetchGoodsList();
  }, [current, pageSize]);

  useEffect(() => {
    fetchMoreCategories();
  }, []);

  // 获取商品列表
  const fetchGoodsList = async () => {
    try {
      const params = {
        ...searchForm.getFieldsValue(),
        pageNum: current,
        pageSize: pageSize,
      };
      const res = await getGoodsList(params);
      setGoodsList(res.data.list || res.data);
      setTotal(res.data.total || 0);
    } catch (err) {
      message.error(t("goods.getListFail"));
    }
  };

  // 加载分类
  const fetchMoreCategories = async () => {
    if (!categoryHasMore || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setShowLoading(true);

    try {
      const res = await getCategoryList({
        pageNum: categoryPage,
        pageSize: CATEGORY_PAGE_SIZE,
      });
      const { list = [], total = 0 } = res.data || {};
      if (list.length > 0) {
        setCategoryList((prev) => [...prev, ...list]);
        setCategoryPage((prev) => prev + 1);
      }
      setCategoryHasMore(categoryList.length + list.length < total);
    } catch (err) {
      message.error(t("goods.getCategoryFail"));
    } finally {
      isLoadingRef.current = false;
      setTimeout(() => setShowLoading(false), 300);
    }
  };

  const handleCategoryScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 30;
    if (isBottom && !isLoadingRef.current) fetchMoreCategories();
  };

  const handleAdd = async (values) => {
    try {
      await addGoods(values);
      message.success(t("goods.addSuccess"));
      setVisible(false);
      fetchGoodsList();
    } catch (err) {
      message.error(t("goods.addFail"));
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateGoods({ ...values, id: currentGoods.id });
      message.success(t("goods.editSuccess"));
      setVisible(false);
      fetchGoodsList();
    } catch (err) {
      message.error(t("goods.editFail"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoods(id);
      message.success(t("goods.deleteSuccess"));
      fetchGoodsList();
    } catch (err) {
      message.error(t("goods.deleteFail"));
    }
  };

  const columns = [
    {
      title: t("goods.name"),
      dataIndex: "goodsName",
      width: 200, // 压缩商品名列宽
      ellipsis: true,
    },
    {
      title: t("goods.category"),
      dataIndex: "categoryName",
      width: 100, // 压缩分类列宽
    },
    {
      title: t("goods.price"),
      dataIndex: "price",
      width: 80,
      render: (p) => `¥${p}`,
    },
    {
      title: t("goods.stock"),
      dataIndex: "stock",
      width: 60,
    },
    {
      title: t("goods.cover"),
      dataIndex: "coverImg",
      width: 80,
      render: (url) =>
        url ? (
          <img
            src={url}
            width={40}
            height={40}
            style={{ objectFit: "cover" }}
          />
        ) : (
          t("common.noData")
        ),
    },
    {
      title: t("goods.status"),
      dataIndex: "status",
      width: 80,
      render: (s) => (
        <ShoppingState
          status={s}
          type="goods"
        />
      ),
    },
    {
      title: t("goods.operation"),
      width: 120,
      render: (r) => (
        <Space>
          <ShoppingButton
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              setIsEdit(true);
              setCurrentGoods(r);
              form.setFieldsValue(r);
              setVisible(true);
            }}
          >
            {t("btn.edit")}
          </ShoppingButton>

          <Popconfirm
            title={t("goods.confirmDelete")}
            onConfirm={() => handleDelete(r.id)}
          >
            <ShoppingButton
              icon={<DeleteOutlined />}
              type="text"
              danger
            >
              {t("btn.delete")}
            </ShoppingButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        height: "70vh",
      }}
    >
      <Card title={t("goods.management")}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Form
            form={searchForm}
            layout="inline"
            style={{ marginBottom: 16, alignItems: "center" }}
          >
            <ShoppingButton
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setIsEdit(false);
                form.resetFields();
                setVisible(true);
              }}
              style={{ marginRight: 16 }}
            >
              {t("btn.add")}
            </ShoppingButton>

            <Form.Item name="goodsName">
              <Input
                placeholder={t("goods.name.placeholder")}
                style={{ width: 160 }}
              />
            </Form.Item>

            <Form.Item name="categoryId">
              <Select
                placeholder={t("goods.category.select")}
                style={{ width: 140 }}
                onPopupScroll={handleCategoryScroll}
                loading={showLoading}
                notFoundContent={
                  showLoading ? <Spin size="small" /> : t("common.noMore")
                }
              >
                {categoryList.map((c) => (
                  <Select.Option
                    key={c.id}
                    value={c.id}
                  >
                    {c.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <ShoppingButton
              type="primary"
              onClick={fetchGoodsList}
              style={{ marginRight: 8 }}
            >
              {t("btn.search")}
            </ShoppingButton>
            <ShoppingButton onClick={() => searchForm.resetFields()}>
              {t("btn.reset")}
            </ShoppingButton>
          </Form>

          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={(page, size) => {
              setCurrent(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
            showLessItems
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={goodsList}
          pagination={false}
          style={{ marginTop: 16 }}
          size="small" // 表格紧凑模式，减少列宽占用
        />
      </Card>

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((v) => (isEdit ? handleUpdate(v) : handleAdd(v)));
        }}
        title={isEdit ? t("btn.edit") : t("btn.add")}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label={t("goods.name")}
            name="goodsName"
            rules={[{ required: true, message: t("goods.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("goods.category")}
            name="categoryId"
            rules={[{ required: true, message: t("goods.categoryRequired") }]}
          >
            <Select
              onPopupScroll={handleCategoryScroll}
              loading={showLoading}
              notFoundContent={
                showLoading ? <Spin size="small" /> : t("common.noMore")
              }
            >
              {categoryList.map((c) => (
                <Select.Option
                  key={c.id}
                  value={c.id}
                >
                  {c.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("goods.price")}
            name="price"
            rules={[{ required: true, message: t("goods.priceRequired") }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label={t("goods.stock")}
            name="stock"
            rules={[{ required: true, message: t("goods.stockRequired") }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label={t("goods.cover")}
            name="coverImg"
            rules={[{ required: true, message: t("goods.stockRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("common.description")}
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label={t("goods.status")}
            name="status"
            rules={[{ required: true, message: t("goods.statusRequired") }]}
          >
            <Select>
              <Select.Option value={1}>{t("status.goods.on")}</Select.Option>
              <Select.Option value={0}>{t("status.goods.off")}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
