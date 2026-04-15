import { useState, useEffect } from "react";
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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getCategoryList,
  addCategory,
  deleteCategory,
  update,
} from "../../api/category";
import ShoppingButton from "../../components/shopping_button";

export default function CategoryManage() {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // 分页状态
  const [current, setCurrent] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(10); // 每页条数
  const [total, setTotal] = useState(0); // 总条数

  // 切换页码/条数
  useEffect(() => {
    fetchCategoryList();
  }, [current, pageSize]);

  // 带分页请求后端
  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList({
        pageNum: current,
        pageSize: pageSize,
      });
      setList(res.data.list || res.data);
      setTotal(res.data.total || 100);
    } catch (err) {
      message.error(res.mas);
    }
  };

  const handleAdd = async (values) => {
    const res = await addCategory(values);
    message.success(res.msg);
    setVisible(false);
    fetchCategoryList();
  };

  const handleUpdate = async (values) => {
    const res = await update(values);
    message.success(res.msg);
    setVisible(false);
    fetchCategoryList();
  };

  const handleDelete = async (id) => {
    const res = await deleteCategory(id);
    message.success(res.msg);
    fetchCategoryList();
  };

  const columns = [
    { title: "分类名称", dataIndex: "categoryName" },
    { title: "排序", dataIndex: "level" },
    {
      title: "操作",
      render: (r) => (
        <Space>
          <ShoppingButton
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              setIsEdit(true);
              form.setFieldsValue(r);
              setVisible(true);
            }}
          >
            编辑
          </ShoppingButton>

          <Popconfirm
            title="确定删除该分类吗？"
            onConfirm={() => handleDelete(r.id)}
          >
            <ShoppingButton
              icon={<DeleteOutlined />}
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

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        height: "70vh",
      }}
    >
      <Card title="分类管理">
        {/* 新增按钮 + 分页 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <ShoppingButton
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsEdit(false);
              form.resetFields();
              setVisible(true);
            }}
          >
            新增分类
          </ShoppingButton>

          {/* 完整分页 */}
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={(page, size) => {
              setCurrent(page);
              setPageSize(size);
            }}
            showSizeChanger // 开启条数切换
            pageSizeOptions={["5", "10", "20"]} // 5 / 10 / 20 条
            showLessItems // 显示简洁页码 1 2 3
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>

        {/* 表格：滚动时表头固定 */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: "calc(70vh - 100px)" }} // 表头固定关键
          style={{ marginTop: 16 }}
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
        title={isEdit ? "编辑分类" : "新增分类"}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="id"
            style={{ display: "none" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="分类名称"
            name="categoryName"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="排序"
            name="level"
            rules={[{ required: true, message: "请输入排序值" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
