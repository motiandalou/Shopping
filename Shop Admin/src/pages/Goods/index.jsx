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
import ShoppingButton from "@/components/shopping_button";
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
      const searchData = searchForm.getFieldsValue();
      // searchData.categoryId 多选自动是 number[]
      const params = {
        pageDTO: {
          pageNum: current,
          pageSize: pageSize,
        },
        queryDTO: {
          goodsName: searchData.goodsName,
          categoryIdList: searchData.categoryId, // 多选数组丢给categoryIdList
        },
      };
      const res = await getGoodsList(params);
      setGoodsList(res.data.list || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch goods list:", err);
    }
  };

  // 加载分类
  const fetchMoreCategories = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setShowLoading(true);

    try {
      const res = await getCategoryList();
      setCategoryList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      isLoadingRef.current = false;
      setTimeout(() => setShowLoading(false), 300);
    }
  };

  const handleAdd = async (values) => {
    try {
      await addGoods(values);
      setVisible(false);
      fetchGoodsList();
    } catch (err) {
      console.error("Failed to add goods:", err);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await updateGoods({ ...values, id: currentGoods.id });
      message.success(res.msg);
      setVisible(false);
      fetchGoodsList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteGoods(id);
      message.success(res.msg);
      fetchGoodsList();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: t("goods.name"),
      dataIndex: "goodsName",
      width: 200,
      ellipsis: true,
    },
    {
      title: t("goods.category"),
      dataIndex: "categoryName",
      width: 100,
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
      render: (v, record) => (
        <span
          style={{
            color: record.stock < record.warningNum ? "red" : "inherit",
          }}
        >
          {v}
        </span>
      ),
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

            {/* ========== 改成多选 mode="multiple" ========== */}
            <Form.Item name="categoryId">
              <Select
                placeholder={t("goods.category.select")}
                style={{ minWidth: 220, maxWidth: 320 }}
                loading={showLoading}
                mode="multiple"
                allowClear
                onChange={() => fetchGoodsList()}
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
            pageSizeOptions={["5", "10", "20", "50"]}
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
          size="small"
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
          {/* 弹窗新增编辑还是单选不变 */}
          <Form.Item
            label={t("goods.category")}
            name="categoryId"
            rules={[{ required: true, message: t("goods.categoryRequired") }]}
          >
            <Select
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
