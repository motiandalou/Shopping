import { useState, useEffect } from "react";
import {
  Card,
  Form,
  InputNumber,
  Table,
  message,
  Modal,
  Pagination,
} from "antd";
import { getGoodsList, updateGoods } from "@/api/goods";
import ShoppingButton from "@/components/shopping_button";
import { EditOutlined } from "@ant-design/icons";

export default function StockWarning() {
  const [form] = Form.useForm();
  const [globalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  // 和商品管理统一分页变量
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // 加载商品列表
  const loadList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        pageDTO: {
          pageNum: page,
          pageSize: pageSize,
        },
        queryDTO: {},
      };
      const res = await getGoodsList(params);
      const pageData = res.data || {};
      const dataArr = pageData.list ?? [];
      const data = dataArr.map((item) => ({
        ...item,
        status: item.stock < item.warningNum ? "预警中" : "正常",
      }));
      setList(data);
      setTotal(pageData.total || 0);
    } catch (err) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  };

  // 页码、每页条数变化自动刷新
  useEffect(() => {
    loadList(current, pageSize);
  }, [current, pageSize]);

  useEffect(() => {
    loadList();
  }, []);

  // 打开修改阈值弹窗
  const openEditModal = (record) => {
    setCurrentItem(record);
    form.setFieldsValue({ warningNum: record.warningNum });
    setModalVisible(true);
  };

  // 保存单个商品预警阈值
  const handleSaveWarning = async () => {
    const values = await form.validateFields();
    const params = {
      id: currentItem.id,
      warningNum: values.warningNum,
    };
    const res = await updateGoods(params);

    if (res.success) {
      message.success(res.msg);
      setModalVisible(false);
      loadList(current, pageSize);
    }
  };

  const columns = [
    { title: "商品名称", dataIndex: "goodsName" },
    { title: "当前库存", dataIndex: "stock" },
    {
      title: "预警阈值",
      dataIndex: "warningNum",
      render: (v) => v ?? "未设置",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (v) => (
        <span style={{ color: v === "预警中" ? "red" : "green" }}>{v}</span>
      ),
    },
    {
      title: "操作",
      render: (_, record) => (
        <ShoppingButton
          icon={<EditOutlined />}
          type="text"
          onClick={() => openEditModal(record)}
        >
          修改阈值
        </ShoppingButton>
      ),
    },
  ];

  return (
    <Card title="库存预警配置">
      {/* 关键：和商品管理一模一样的flex布局 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div></div>
        {/* 右上角分页，配置完全对齐 */}
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={(page, size) => {
            setCurrent(page);
            setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          showLessItems
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        style={{ marginTop: 16 }}
      />

      {/* 修改阈值弹窗 */}
      <Modal
        title="修改预警阈值"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveWarning}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="预警阈值"
            name="warningNum"
            rules={[{ required: true, message: "请输入预警阈值" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入预警阈值"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
