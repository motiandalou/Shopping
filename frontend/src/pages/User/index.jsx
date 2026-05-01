import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Form,
  message,
  Popconfirm,
  Space,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { getUserList, updateUser, updateUserStatus } from "../../api/user";
import ShoppingButton from "@/components/shopping_button";
import ShoppingState from "../../components/Shopping_state";

export default function UserManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const [userList, setUserList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUserList();
  }, [pagination.current]);

  // 获取用户列表（和商品列表写法完全一样）
  const fetchUserList = async () => {
    try {
      const params = {
        ...searchForm.getFieldsValue(),
      };
      const res = await getUserList(params);
      setUserList(res.data);
      setPagination({
        ...pagination,
        total: res.data?.length || 0,
      });
    } catch (err) {
      message.error(t("user.getListFail"));
    }
  };

  // 修改用户
  const handleUpdate = async (values) => {
    try {
      await updateUser({ ...values, id: currentUser.id });
      message.success(t("user.updateSuccess"));
      setModalVisible(false);
      fetchUserList();
    } catch (err) {
      message.error(t("user.updateFail"));
    }
  };

  // 编辑打开
  const handleEdit = (record) => {
    setIsEdit(true);
    setCurrentUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 提交
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        handleUpdate(values);
      }
    });
  };

  // 状态切换：禁用 / 启用
  const changeStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      message.success(t("user.operateSuccess"));
      fetchUserList();
    } catch (err) {
      message.error(t("user.operateFail"));
    }
  };

  // 管理员 / 普通用户切换 / 管理员
  const showDiffRole = (role) => {
    switch (role) {
      case 0:
        return t("user.role.normal");
      case 1:
        return t("user.role.manager");
      case 2:
        return t("user.role.super");
    }
  };

  const columns = [
    {
      title: t("user.username"),
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: t("user.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("user.address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("user.role"),
      dataIndex: "role",
      render: (role) => showDiffRole(role),
    },
    {
      title: t("user.status"),
      dataIndex: "status",
      render: (status) => (
        <ShoppingState
          status={status}
          type="user"
        />
      ),
    },
    // {
    //   title: t("user.operation"),
    //   render: (_, r) => (
    //     <Space>
    //       {/* 启用/禁用 */}
    //       <ShoppingButton
    //         type="text"
    //         onClick={() => changeStatus(r.id, r.status === 1 ? 0 : 1)}
    //       >
    //         {r.role !== 2 &&
    //           (r.status === 1 ? t("user.ban") : t("user.enable"))}
    //       </ShoppingButton>

    //       {r.role === 0 && (
    //         <ShoppingButton
    //           type="text"
    //           icon={<EditOutlined />}
    //           onClick={() => handleEdit(r)}
    //         >
    //           {t("btn.edit")}
    //         </ShoppingButton>
    //       )}

    //       <Popconfirm
    //         title={t("user.confirmDelete")}
    //         onConfirm={() => handleDelete(r.id)}
    //       ></Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title={t("user.management")}>
        {/* 查询表单（和商品一样） */}
        <Form
          form={searchForm}
          layout="inline"
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="userName">
            <Input placeholder={t("user.username.placeholder")} />
          </Form.Item>

          <Form.Item name="phone">
            <Input placeholder={t("user.phone.placeholder")} />
          </Form.Item>

          <ShoppingButton
            type="primary"
            onClick={fetchUserList}
          >
            {t("btn.search")}
          </ShoppingButton>

          <ShoppingButton onClick={() => searchForm.resetFields()}>
            {t("btn.reset")}
          </ShoppingButton>
        </Form>

        {/* 表格（和商品风格完全一样） */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={userList}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page) => setPagination({ ...pagination, current: page }),
          }}
        />
      </Card>
    </div>
  );
}
