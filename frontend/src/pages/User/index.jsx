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

import { getUserList, updateUser, updateUserStatus } from "../../api/user";
import ShoppingButton from "../../components/shopping_button";
import ShoppingState from "../../components/Shopping_state";

export default function UserManage() {
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
      message.error("获取用户列表失败");
    }
  };

  // 修改用户
  const handleUpdate = async (values) => {
    try {
      await updateUser({ ...values, id: currentUser.id });
      message.success("修改成功");
      setModalVisible(false);
      fetchUserList();
    } catch (err) {
      message.error("修改失败");
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
      } else {
        handleAdd(values);
      }
    });
  };

  // 状态切换：禁用 / 启用
  const changeStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      message.success("操作成功");
      fetchUserList();
    } catch (err) {
      message.error("操作失败");
    }
  };

  // 管理员 / 普通用户切换 / 管理员
  const showDiffRole = (role) => {
    switch (role) {
      case 0:
        return "普通用户";
      case 1:
        return "管理员";
      case 2:
        return "超级管理员";
    }
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "收货地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "角色",
      dataIndex: "role",
      render: (role) => showDiffRole(role),
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status) => (
        <ShoppingState
          status={status}
          type="user"
        />
      ),
    },
    {
      title: "操作",
      render: (_, r) => (
        <Space>
          {/* 启用/禁用 */}
          <ShoppingButton
            type="text"
            onClick={() => changeStatus(r.id, r.status === 1 ? 0 : 1)}
          >
            {r.role !== 2 && (r.status === 1 ? "禁用" : "启用")}
          </ShoppingButton>

          {r.role === 0 && (
            <ShoppingButton
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(r)}
            >
              编辑
            </ShoppingButton>
          )}

          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(r.id)}
          ></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="用户管理">
        {/* 查询表单（和商品一样） */}
        <Form
          form={searchForm}
          layout="inline"
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="userName">
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item name="phone">
            <Input placeholder="手机号" />
          </Form.Item>

          <ShoppingButton
            type="primary"
            onClick={fetchUserList}
          >
            查询
          </ShoppingButton>

          <ShoppingButton onClick={() => searchForm.resetFields()}>
            重置
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

      {/* 弹窗：新增/编辑用户 */}
      {/* <Modal
        title={isEdit ? "编辑用户" : "新增用户"}
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
            label="用户名"
            name="userName"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="收货地址"
            name="address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
          >
            <Select>
              <Select.Option value={0}>普通用户</Select.Option>
              <Select.Option value={1}>管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
          >
            <Select>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
}
