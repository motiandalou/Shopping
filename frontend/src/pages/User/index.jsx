import { useState, useEffect } from "react";
import { Table, Button, Card, Space, message, Popconfirm } from "antd";
import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});

export default function UserManage() {
  const [userList, setUserList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    getUserList();
  }, [pagination.current]);

  const getUserList = async () => {
    const res = await request.get("/api/admin/user/list", {
      params: pagination,
    });
    setUserList(res.data.list);
    setPagination({ ...pagination, total: res.data.total });
  };

  const changeStatus = async (id, status) => {
    await request.put(`/api/admin/user/status/${id}`, { status });
    message.success("操作成功");
    getUserList();
  };

  const columns = [
    // { title: "ID", dataIndex: "userId" },
    { title: "用户名", dataIndex: "username" },
    { title: "手机号", dataIndex: "phone" },
    { title: "状态", render: (r) => (r.status === 1 ? "正常" : "禁用") },
    {
      title: "操作",
      render: (r) => (
        <Space>
          <Button
            type="text"
            onClick={() => changeStatus(r.userId, r.status === 1 ? 0 : 1)}
          >
            {r.status === 1 ? "禁用" : "启用"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="用户管理">
        <Table
          rowKey="userId"
          columns={columns}
          dataSource={userList}
          pagination={{
            ...pagination,
            onChange: (p) => setPagination({ ...pagination, current: p }),
          }}
        />
      </Card>
    </div>
  );
}
