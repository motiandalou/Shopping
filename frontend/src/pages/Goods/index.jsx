import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Form,
  Modal,
  Upload,
  message,
  Popconfirm,
  Space,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { getCategoryList } from "../../api/category";

// 配置 axios 请求头（登录后把 token 存在 localStorage）
const request = axios.create({
  baseURL: "http://localhost:8080", // 你的后端地址
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

// 商品管理主页面
export default function GoodsManage() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 商品列表
  const [goodsList, setGoodsList] = useState([]);
  // 分类列表
  const [categoryList, setCategoryList] = useState([]);
  // 弹窗显示
  const [modalVisible, setModalVisible] = useState(false);
  // 是编辑还是新增
  const [isEdit, setIsEdit] = useState(false);
  // 当前编辑商品
  const [currentGoods, setCurrentGoods] = useState(null);
  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 页面加载：获取商品列表 + 分类列表
  useEffect(() => {
    getGoodsList();
    fetchCategoryList();
  }, [pagination.current]);

  // ======================
  // 1. 获取商品列表
  // ======================
  const getGoodsList = async () => {
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        ...searchForm.getFieldsValue(),
      };
      const res = await request.get("/api/admin/goods/list", { params });
      setGoodsList(res.data.list);
      setPagination({
        ...pagination,
        total: res.data.total,
      });
    } catch (err) {
      message.error("获取商品列表失败");
    }
  };

  // 获取商品分类
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      setCategoryList(res.data);
    } catch (err) {
      message.error(res.msg);
    }
  };

  // ======================
  // 3. 新增商品
  // ======================
  const addGoods = async (values) => {
    try {
      await request.post("/api/admin/goods", values);
      message.success("新增成功");
      setModalVisible(false);
      getGoodsList();
    } catch (err) {
      message.error("新增失败");
    }
  };

  // ======================
  // 4. 修改商品
  // ======================
  const updateGoods = async (values) => {
    try {
      await request.put(`/api/admin/goods/${currentGoods.goodsId}`, values);
      message.success("修改成功");
      setModalVisible(false);
      getGoodsList();
    } catch (err) {
      message.error("修改失败");
    }
  };

  // ======================
  // 5. 上下架
  // ======================
  const changeStatus = async (id, status) => {
    try {
      await request.put(`/api/admin/goods/status/${id}`, { status });
      message.success(status === 1 ? "上架成功" : "下架成功");
      getGoodsList();
    } catch (err) {
      message.error("操作失败");
    }
  };

  // ======================
  // 6. 删除商品
  // ======================
  const deleteGoods = async (id) => {
    try {
      await request.delete(`/api/admin/goods/${id}`);
      message.success("删除成功");
      getGoodsList();
    } catch (err) {
      message.error("删除失败");
    }
  };

  // ======================
  // 打开新增弹窗
  // ======================
  const handleAdd = () => {
    setIsEdit(false);
    form.resetFields();
    setModalVisible(true);
  };

  // ======================
  // 打开编辑弹窗
  // ======================
  const handleEdit = (record) => {
    setIsEdit(true);
    setCurrentGoods(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // ======================
  // 提交表单
  // ======================
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        updateGoods(values);
      } else {
        addGoods(values);
      }
    });
  };

  // ======================
  // 表格列
  // ======================
  const columns = [
    {
      title: "ID",
      dataIndex: "goodsId",
      key: "goodsId",
      width: 80,
    },
    {
      title: "商品封面",
      render: (_, record) => (
        <img
          src={record.cover}
          width={50}
          alt="cover"
        />
      ),
    },
    {
      title: "商品名称",
      dataIndex: "name",
      key: "name",
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
      title: "状态",
      render: (_, r) => (
        <span style={{ color: r.status === 1 ? "green" : "gray" }}>
          {r.status === 1 ? "上架中" : "已下架"}
        </span>
      ),
    },
    {
      title: "操作",
      render: (_, r) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r)}
          >
            编辑
          </Button>
          {r.status === 0 ? (
            <Button
              type="text"
              onClick={() => changeStatus(r.goodsId, 1)}
            >
              上架
            </Button>
          ) : (
            <Button
              type="text"
              onClick={() => changeStatus(r.goodsId, 0)}
            >
              下架
            </Button>
          )}
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => deleteGoods(r.goodsId)}
          >
            <Button
              type="text"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="商品管理">
        {/* 查询区域 */}
        <Form
          form={searchForm}
          layout="inline"
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="keyword">
            <Input placeholder="商品名称" />
          </Form.Item>
          <Form.Item name="id">
            <Select
              placeholder="选择分类"
              style={{ width: 180 }}
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
          <Form.Item name="status">
            <Select
              placeholder="状态"
              style={{ width: 120 }}
            >
              <Select.Option value={1}>上架</Select.Option>
              <Select.Option value={0}>下架</Select.Option>
            </Select>
          </Form.Item>
          <Button
            type="primary"
            onClick={getGoodsList}
            style={{ marginRight: 20 }}
          >
            查询
          </Button>
          <Button onClick={() => searchForm.resetFields()}>重置</Button>
        </Form>

        {/* 新增按钮 */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: 20 }}
        >
          新增商品
        </Button>

        {/* 商品表格 */}
        <Table
          rowKey="goodsId"
          columns={columns}
          dataSource={goodsList}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => setPagination({ ...pagination, current: page }),
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={isEdit ? "编辑商品" : "新增商品"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="分类"
            name="categoryId"
            rules={[{ required: true }]}
          >
            <Select>
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
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="库存"
            name="stock"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="封面图"
            name="cover"
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
          >
            <Select>
              <Select.Option value={1}>上架</Select.Option>
              <Select.Option value={0}>下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
