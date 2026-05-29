import { useState, useEffect } from "react";
import { Card, Form, InputNumber, Button, Table, message, Modal } from "antd";
import { getGoodsList, updateGoods } from "@/api/goods";
import ShoppingButton from "@/components/shopping_button";
import { EditOutlined } from "@ant-design/icons";

export default function StockWarning() {
  const [form] = Form.useForm();
  const [globalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // 加载商品列表
  const loadList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getGoodsList({ pageNum: page, pageSize });
      const data = (res.data || []).map((item) => ({
        ...item,
        // 库存 < 预警阈值 → 预警中
        status: item.stock < item.warningNum ? "预警中" : "正常",
      }));
      setList(data);
      setPagination({
        current: page,
        pageSize,
        total: res.data?.total || data.length,
      });
    } catch (err) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  // TODO 保存全局预警设置
  const handleSaveGlobal = async () => {
    const values = await globalForm.validateFields();
    // 保存后刷新列表状态
    loadList(pagination.current, pagination.pageSize);
  };

  // 打开修改阈值弹窗
  const openEditModal = (record) => {
    setCurrentItem(record);
    form.setFieldsValue({ warningNum: record.warningNum });
    setModalVisible(true);
  };

  // 保存单个商品预警阈值
  const handleSaveWarning = async () => {
    const values = await form.validateFields();
    // 参数
    const params = {
      id: currentItem.id,
      warningNum: values.warningNum,
    };
    const res = await updateGoods(params);

    if (res.success) {
      message.success(res.msg);
      // 关闭弹窗
      setModalVisible(false);
      // 刷新列表
      loadList(pagination.current, pagination.pageSize);
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
    <Card
      title="库存预警配置"
      bordered={false}
    >
      <Form
        form={globalForm}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        style={{ marginBottom: 20 }}
      >
        <Form.Item
          label="全局默认预警库存"
          name="globalWarning"
          rules={[{ required: true, message: "请输入全局预警库存" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="低于该数量预警"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5 }}>
          <ShoppingButton onClick={handleSaveGlobal}>
            保存全局设置
          </ShoppingButton>
        </Form.Item>
      </Form>

      <Card
        size="small"
        title="商品库存预警列表"
      >
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => loadList(page, pageSize),
          }}
        />
      </Card>

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
