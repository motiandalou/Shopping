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
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    const res = await getCategoryList();
    setList(res.data);
  };

  const handleAdd = async (values) => {
    const res = await addCategory(values);
    message.success(res.msg);
    setVisible(false);
    fetchCategoryList();
  };

  // 编辑
  const handleUpdate = async (values) => {
    console.log("values", values);
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
    // { title: "ID", dataIndex: "id" },
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
              setCurrent(r);
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
    <div style={{ padding: 20 }}>
      <Card title="分类管理">
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

        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          style={{ marginTop: 20 }}
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
          {/* 隐藏ID字段，仅用于传参，用户不可见 */}
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
