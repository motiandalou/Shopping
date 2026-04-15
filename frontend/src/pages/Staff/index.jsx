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

import {
  getStaffList,
  addStaff,
  deleteStaff,
  updateStaff,
} from "../../api/staff";
import { getStaffInfo } from "../../api/staff"; // 加这个

export default function StaffManage() {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // 当前登录人

  // 获取当前登录用户信息
  useEffect(() => {
    getLoginUserInfo();
    fetchStaffList();
  }, []);

  // 获取当前登录人
  const getLoginUserInfo = async () => {
    try {
      const res = await getStaffInfo();
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 获取员工列表
  const fetchStaffList = async () => {
    try {
      const res = await getStaffList({});
      setList(res.data || []);
    } catch (err) {
      message.error("获取员工列表失败");
    }
  };

  // 新增员工
  const handleAdd = async (values) => {
    try {
      // role(1): 默认是员工
      const params = { ...values, role: 1 };
      console.log("params", params);
      const res = await addStaff(params);
      if (res.success) {
        setVisible(false);
        fetchStaffList();
      } else {
        message.error(res.msg);
      }
    } catch (err) {
      message.error(res.msg);
    }
  };

  // 修改员工
  const handleUpdate = async (values) => {
    try {
      await updateStaff(values);
      message.success("修改成功");
      setVisible(false);
      fetchStaffList();
    } catch (err) {
      message.error("修改失败");
    }
  };

  // 删除员工
  const handleDelete = async (id) => {
    try {
      await deleteStaff(id);
      message.success("删除成功");
      fetchStaffList();
    } catch (err) {
      message.error("删除失败");
    }
  };

  const columns = [
    { title: "员工账号", dataIndex: "userName" },
    { title: "员工姓名", dataIndex: "realName" },
    {
      title: "角色",
      dataIndex: "role",
      render: (role) => (role === 0 ? "老板" : "员工"),
    },
    {
      title: "操作",
      render: (r) => {
        // 如果是老板自己，不显示编辑/删除
        const isSelf = currentUser?.id === r.id;
        // 只能操作员工，不能操作老板
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
              编辑
            </ShoppingButton>

            <Popconfirm
              title="确定删除该员工吗？"
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
        );
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="员工管理">
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
            新增员工
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
        title={isEdit ? "编辑员工" : "新增员工"}
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
            label="登录账号"
            name="userName"
            rules={[{ required: true, message: "请输入登录账号" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="登录密码"
            name="password"
            rules={[{ required: !isEdit, message: "请输入登录密码" }]}
          >
            <Input.Password placeholder="新增时必填" />
          </Form.Item>

          <Form.Item
            label="员工姓名"
            name="realName"
            rules={[{ required: true, message: "请输入员工姓名" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
