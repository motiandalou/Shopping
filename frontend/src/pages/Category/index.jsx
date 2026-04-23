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
import { useTranslation } from "react-i18next";

export default function CategoryManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // 分页状态
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCategoryList();
  }, [current, pageSize]);

  const fetchCategoryList = async () => {
    try {
      const res = await getCategoryList({
        pageNum: current,
        pageSize: pageSize,
      });
      setList(res.data.list || res.data);
      setTotal(res.data.total || 100);
    } catch (err) {
      console.error("Failed to fetch goods list:", err);
    }
  };

  const handleAdd = async (values) => {
    try {
      const res = await addCategory(values);
      message.success(res.msg);
      setVisible(false);
      fetchCategoryList();
    } catch (err) {
      message.error(t("category.addFail"));
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await update(values);
      message.success(res.msg);
      setVisible(false);
      fetchCategoryList();
    } catch (err) {
      message.error(t("category.editFail"));
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id);
      message.success(res.msg);
      fetchCategoryList();
    } catch (err) {
      message.error(t("category.deleteFail"));
    }
  };

  const columns = [
    { title: t("category.name"), dataIndex: "categoryName" },
    { title: t("category.sort"), dataIndex: "level" },
    {
      title: t("category.operation"),
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
            {t("btn.edit")}
          </ShoppingButton>

          <Popconfirm
            title={t("category.confirmDelete")}
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
      <Card title={t("category.management")}>
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
            {t("btn.add")}
          </ShoppingButton>

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
            showTotal={(total) => t("category.total").replace("{total}", total)}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          scroll={{ y: "calc(70vh - 100px)" }}
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
        title={isEdit ? t("category.edit") : t("category.add")}
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
            label={t("category.name")}
            name="categoryName"
            rules={[{ required: true, message: t("category.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("category.sort")}
            name="level"
            rules={[{ required: true, message: t("category.sortRequired") }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
