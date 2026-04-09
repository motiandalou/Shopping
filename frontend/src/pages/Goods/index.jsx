import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Form,
  Modal,
  message,
  Popconfirm,
  Space,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getGoodsList,
  addGoods,
  updateGoods,
  deleteGoods,
} from "../../api/goods";

// 导入分类接口
import { getCategoryList } from "../../api/category";

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

  useEffect(() => {
    fetchGoodsList();
    fetchCategoryList();
  }, [pagination.current]);

  // 获取商品列表
  const fetchGoodsList = async () => {
    try {
      const params = {
        ...searchForm.getFieldsValue(),
      };
      const res = await getGoodsList(params);
      setGoodsList(res.data);
      setPagination({
        ...pagination,
        total: res.data?.length || 0,
      });
    } catch (err) {
      message.error("获取商品列表失败");
    }
  };

  // 获取分类
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList();
      setCategoryList(res.data);
    } catch (err) {
      message.error("获取分类失败");
    }
  };

  // 新增
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

  // 修改
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

  // 删除
  const handleDelete = async (id) => {
    try {
      await deleteGoods(id);
      message.success("删除成功");
      fetchGoodsList();
    } catch (err) {
      message.error("删除失败");
    }
  };

  // 打开编辑
  const handleEdit = (record) => {
    setIsEdit(true);
    setCurrentGoods(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 提交
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        handleUpdate(values);
      } else {
        handleAdd(values);
      }
    });
  };

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
        <span style={{ color: status === 1 ? "green" : "gray" }}>
          {status === 1 ? "已上架" : "未上架"}
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
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(r.id)}
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
            >
              {categoryList?.map((c) => (
                <Select.Option
                  key={c.id}
                  value={c.id}
                >
                  {c.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            onClick={fetchGoodsList}
          >
            查询
          </Button>
          <Button onClick={() => searchForm.resetFields()}>重置</Button>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={goodsList}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page) => setPagination({ ...pagination, current: page }),
          }}
        />
      </Card>

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
            rules={[{ required: true }]}
          >
            <Select>
              {categoryList?.map((c) => (
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
