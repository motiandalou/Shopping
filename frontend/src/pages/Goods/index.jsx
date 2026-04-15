import { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Select,
  Form,
  Modal,
  message,
  Popconfirm,
  Space,
  Card,
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

export default function GoodsManage() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [goodsList, setGoodsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentGoods, setCurrentGoods] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 分类滚动加载状态
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const CATEGORY_PAGE_SIZE = 10;

  // 锁和页码计数器（防止跳过page2）
  const isLoadingRef = useRef(false);
  const totalCategoriesRef = useRef(0);

  useEffect(() => {
    fetchGoodsList();
  }, [pagination.current]);

  useEffect(() => {
    // 组件挂载时先加载第一页
    fetchMoreCategories();
  }, []);

  // 获取商品列表（修复：带上分页参数）
  const fetchGoodsList = async () => {
    try {
      const params = {
        ...searchForm.getFieldsValue(),
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      const res = await getGoodsList(params);
      setGoodsList(res.data.list || res.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total || res.data?.length || 0,
      }));
    } catch (err) {
      message.error("获取商品列表失败");
    }
  };

  // 严格控制页码的加载函数 + 丝滑loading
  const fetchMoreCategories = async () => {
    // 1. 双重保险：防止重复请求和无数据时请求
    if (!categoryHasMore || categoryLoading || isLoadingRef.current) {
      return;
    }

    // 2. 加锁：同一时间只能有一个请求
    isLoadingRef.current = true;
    setCategoryLoading(true);
    setShowLoading(true);

    try {
      // 发起请求，使用当前的 categoryPage
      const res = await getCategoryList({
        pageNum: categoryPage,
        pageSize: CATEGORY_PAGE_SIZE,
      });

      const { list = [], total = 0 } = res.data || {};

      // 初始化总数
      if (categoryPage === 1) {
        totalCategoriesRef.current = total;
      }

      // 拼接数据
      if (list.length > 0) {
        setCategoryList((prev) => [...prev, ...list]);
        // 页码自增 (在这里 ++，保证顺序)
        setCategoryPage((prev) => prev + 1);
      }

      // 判断是否还有更多
      const loadedCount = categoryList.length + list.length;
      setCategoryHasMore(loadedCount < total);
    } catch (err) {
      message.error(res.msg);
    } finally {
      // 解锁和分级隐藏loading
      setCategoryLoading(false);
      setTimeout(() => setShowLoading(false), 300);
      isLoadingRef.current = false;
    }
  };

  // 滚动事件处理
  const handleCategoryScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // 离底部 30px 触发，避免敏感
    const isBottom = scrollTop + clientHeight >= scrollHeight - 30;

    // 🔥 使用 ref 保证状态最新，且不会因为 state 延迟导致漏请求
    if (isBottom && !categoryLoading && !isLoadingRef.current) {
      fetchMoreCategories();
    }
  };

  // 👇 补全：新增商品逻辑
  const handleAdd = async (values) => {
    try {
      await addGoods(values);
      message.success("新增成功");
      setModalVisible(false);
      fetchGoodsList();
    } catch (err) {
      message.error("新增失败");
    }
  };

  // 👇 补全：编辑商品逻辑
  const handleUpdate = async (values) => {
    try {
      await updateGoods({ ...values, id: currentGoods.id });
      message.success("修改成功");
      setModalVisible(false);
      fetchGoodsList();
    } catch (err) {
      message.error("修改失败");
    }
  };

  // 👇 补全：删除商品逻辑
  const handleDelete = async (id) => {
    try {
      await deleteGoods(id);
      message.success("删除成功");
      fetchGoodsList();
    } catch (err) {
      message.error("删除失败");
    }
  };

  // 👇 补全：打开编辑弹窗逻辑
  const handleEdit = (record) => {
    setIsEdit(true);
    setCurrentGoods(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 👇 补全：表单提交逻辑
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        handleUpdate(values);
      } else {
        handleAdd(values);
      }
    });
  };

  // 👇 补全：表格列配置（和你原来的完全一致）
  const columns = [
    {
      title: "商品名称",
      dataIndex: "goodsName",
      key: "goodsName",
    },
    {
      title: "分类",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (t) => `¥${t}`,
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "封面图",
      dataIndex: "coverImg",
      key: "coverImg",
      render: (url) =>
        url ? (
          <img
            src={url}
            width={50}
            alt="cover"
          />
        ) : (
          "无"
        ),
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status) => (
        <ShoppingState
          status={status}
          type="goods"
        />
      ),
    },
    {
      title: "操作",
      render: (_, r) => (
        <Space>
          <ShoppingButton
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r)}
          >
            编辑
          </ShoppingButton>

          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(r.id)}
          >
            <ShoppingButton
              type="text"
              danger
            >
              删除
            </ShoppingButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 👇 补全：完整的return渲染（Modal部分补全）
  return (
    <div style={{ padding: 20 }}>
      <Card title="商品管理">
        <Form
          form={searchForm}
          layout="inline"
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="goodsName">
            <Input placeholder="商品名称" />
          </Form.Item>
          <Form.Item name="categoryId">
            <Select
              placeholder="选择分类"
              style={{ width: 180 }}
              onPopupScroll={handleCategoryScroll}
              loading={showLoading} // 显示全局 loading
              notFoundContent={
                showLoading ? <Spin size="small" /> : "无更多分类"
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
          >
            查询
          </ShoppingButton>
          <ShoppingButton onClick={() => searchForm.resetFields()}>
            重置
          </ShoppingButton>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={goodsList}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) =>
              setPagination((prev) => ({ ...prev, current: page })),
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
        />
      </Card>

      {/* 补全Modal完整内容 */}
      <Modal
        title={isEdit ? "编辑商品" : "新增商品"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="商品名称"
            name="goodsName"
            rules={[{ required: true, message: "请输入商品名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="分类"
            name="categoryId"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select
              onPopupScroll={handleCategoryScroll}
              loading={showLoading}
              notFoundContent={
                showLoading ? <Spin size="small" /> : "无更多分类"
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
            label="价格"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="库存"
            name="stock"
            rules={[{ required: true, message: "请输入库存" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="封面图"
            name="coverImg"
          >
            <Input placeholder="图片URL" />
          </Form.Item>

          <Form.Item
            label="商品描述"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="上架状态"
            name="status"
            rules={[{ required: true, message: "请选择上架状态" }]}
          >
            <Select>
              <Select.Option value={1}>已上架</Select.Option>
              <Select.Option value={0}>未上架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
