import { useState, useEffect, useRef } from "react";
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
  Select,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getHotGoodsPage,
  addHotGoods,
  updateHotSort,
  deleteHotGoods,
} from "@/api/hot";
import { getGoodsList } from "@/api/goods";
import ShoppingButton from "@/components/shopping_button";
import { useTranslation } from "react-i18next";

export default function HotGoodsManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 表格数据源
  const [hotList, setHotList] = useState([]);
  // 全部可选商品下拉列表
  const [allGoodsSelect, setAllGoodsSelect] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentHot, setCurrentHot] = useState(null);

  // 分页状态
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [goodsLoading, setGoodsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  // 分页切换触发刷新列表
  useEffect(() => {
    fetchHotList();
  }, [current, pageSize]);

  // 页面加载获取可选商品下拉
  useEffect(() => {
    fetchAllSelectGoods();
  }, []);

  // 获取热销分页列表
  const fetchHotList = async () => {
    try {
      const params = {
        pageDTO: {
          pageNum: current,
          pageSize: pageSize,
        },
      };
      const res = await getHotGoodsPage(params);
      setHotList(res.data.list || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // 获取所有商品下拉
  const fetchAllSelectGoods = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setGoodsLoading(true);
    try {
      const params = {
        pageDTO: { pageNum: 1, pageSize: 50 },
        queryDTO: { status: 1 },
      };
      const res = await getGoodsList(params);
      setAllGoodsSelect(res.data.list || []);
    } catch (err) {
      console.error("Get product select list failed：", err);
    } finally {
      isLoadingRef.current = false;
      setTimeout(() => setGoodsLoading(false), 300);
    }
  };

  // 新增热销商品
  const handleAdd = async (values) => {
    try {
      await addHotGoods({
        goodsId: values.goodsId,
        sort: values.sort,
      });
      setVisible(false);
      fetchHotList();
    } catch (err) {
      console.error(err);
    }
  };

  // 修改排序权重
  const handleUpdate = async (values) => {
    try {
      await updateHotSort({
        id: currentHot.id,
        sort: values.sort,
      });
      setVisible(false);
      fetchHotList();
    } catch (err) {
      console.error(err);
    }
  };

  // 移除热销
  const handleDelete = async (id) => {
    try {
      await deleteHotGoods(id);
      fetchHotList();
    } catch (err) {
      console.error(err);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: t("hot.goodsName"),
      dataIndex: "goodsName",
      width: 240,
      ellipsis: true,
    },
    {
      title: t("hot.sortWeight"),
      dataIndex: "sort",
      width: 120,
      render: (val) => (
        <span style={{ color: val >= 9999 ? "#f5222d" : "#000" }}>{val}</span>
      ),
    },
    {
      title: t("hot.createTime"),
      dataIndex: "createTime",
      width: 180,
    },
    {
      title: t("common.operation"),
      width: 160,
      render: (record) => (
        <Space>
          <ShoppingButton
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              setIsEdit(true);
              setCurrentHot(record);
              form.setFieldsValue({
                goodsId: record.goodsId,
                sort: record.sort,
              });
              setVisible(true);
            }}
          >
            {t("btn.edit")}
          </ShoppingButton>

          <Popconfirm
            title={t("hot.confirmRemove")}
            onConfirm={() => handleDelete(record.id)}
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
      <Card title={t("hot.management")}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Form
            form={searchForm}
            layout="inline"
            style={{ alignItems: "center" }}
          >
            {/* 新增热销按钮 */}
            <ShoppingButton
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setIsEdit(false);
                form.resetFields();
                // 默认权重5000，填9999自动置顶
                form.setFieldsValue({ sort: 5000 });
                setVisible(true);
              }}
              style={{ marginRight: 16 }}
            >
              {t("btn.add")}
            </ShoppingButton>
          </Form>

          {/* 分页组件 */}
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
            showTotal={(total) =>
              `${t("common.total")} ${total} ${t("common.item")}`
            }
          />
        </div>

        {/* 表格 */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={hotList}
          pagination={false}
          style={{ marginTop: 16 }}
          size="small"
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) =>
              isEdit ? handleUpdate(values) : handleAdd(values),
            );
        }}
        title={isEdit ? t("btn.edit") : t("btn.add")}
        width={520}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {/* 新增模式才展示商品选择，编辑只改权重 */}
          {!isEdit && (
            <Form.Item
              label={t("hot.selectGoods")}
              name="goodsId"
              rules={[{ required: true, message: t("hot.goodsRequired") }]}
            >
              <Select
                placeholder={t("hot.selectGoodsPlaceholder")}
                loading={goodsLoading}
                showSearch
                filterOption={(input, opt) => opt.children.includes(input)}
              >
                {allGoodsSelect.map((item) => (
                  <Select.Option
                    key={item.id}
                    value={item.id}
                  >
                    {item.goodsName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label={t("hot.sortWeight")}
            name="sort"
            rules={[
              { required: true, message: t("hot.sortRequired") },
              { pattern: /^[0-9]+$/, message: t("hot.sortNumberTip") },
            ]}
            extra={<span style={{ color: "#f5222d" }}>{t("hot.topTip")}</span>}
          >
            <Input
              type="number"
              min={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
