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
import ShoppingButton from "../../components/shopping_button";
import { useTranslation } from "react-i18next";

import {
  getStaffList,
  addStaff,
  deleteStaff,
  updateStaff,
} from "../../api/staff";
import { getStaffInfo } from "../../api/staff";

export default function StaffManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getLoginUserInfo();
    fetchStaffList();
  }, []);

  const getLoginUserInfo = async () => {
    try {
      const res = await getStaffInfo();
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await getStaffList({});
      setList(res.data || []);
    } catch (err) {
      message.error(t("staff.getFail"));
    }
  };

  const handleAdd = async (values) => {
    try {
      const params = { ...values, role: 1 };
      const res = await addStaff(params);
      if (res.success) {
        setVisible(false);
        fetchStaffList();
        message.success(t("staff.addSuccess"));
      } else {
        message.error(res.msg);
      }
    } catch (err) {
      message.error(t("staff.addFail"));
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateStaff(values);
      message.success(t("staff.editSuccess"));
      setVisible(false);
      fetchStaffList();
    } catch (err) {
      message.error(t("staff.editFail"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStaff(id);
      message.success(t("staff.deleteSuccess"));
      fetchStaffList();
    } catch (err) {
      message.error(t("staff.deleteFail"));
    }
  };

  const columns = [
    { title: t("staff.account"), dataIndex: "userName" },
    { title: t("staff.name"), dataIndex: "realName" },
    {
      title: t("staff.role"),
      dataIndex: "role",
      render: (role) =>
        role === 0 ? t("staff.role.admin") : t("staff.role.staff"),
    },
    {
      title: t("staff.operation"),
      render: (r) => {
        const isSelf = currentUser?.id === r.id;
        const canOperate = r.role === 1;

        if (isSelf || !canOperate) {
          return <span>-</span>;
        }

        return (
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
              title={t("staff.confirmDelete")}
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
        );
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title={t("staff.management")}>
        <div style={{ marginBottom: 16 }}>
          <ShoppingButton
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setIsEdit(false);
              form.resetFields();
              setVisible(true);
            }}
          >
            {t("staff.add")}
          </ShoppingButton>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
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
        title={isEdit ? t("staff.edit") : t("staff.add")}
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
            label={t("staff.account")}
            name="userName"
            rules={[{ required: true, message: t("staff.accountRequired") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("staff.password")}
            name="password"
            rules={[
              { required: !isEdit, message: t("staff.passwordRequired") },
            ]}
          >
            <Input.Password placeholder={t("staff.passwordPlaceholder")} />
          </Form.Item>

          <Form.Item
            label={t("staff.name")}
            name="realName"
            rules={[{ required: true, message: t("staff.nameRequired") }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
