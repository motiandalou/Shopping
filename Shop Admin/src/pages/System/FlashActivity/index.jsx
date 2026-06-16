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
  DatePicker,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getFlashActivityList,
  addFlashActivity,
  updateFlashActivity,
  deleteFlashActivity,
  addFlashSaleGoods,
  deleteFlashSaleGood,
} from "../../../api/flash";
import { getGoodsList } from "../../../api/goods";
import ShoppingButton from "@/components/shopping_button";
import ShoppingState from "../../../components/Shopping_state";
import { useTranslation } from "react-i18next";

export default function FlashActivityManage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 活动列表
  const [activityList, setActivityList] = useState([]);
  // 弹窗状态
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  // 绑定商品弹窗
  const [goodsModalVisible, setGoodsModalVisible] = useState(false);
  const [allGoodsList, setAllGoodsList] = useState([]);

  // 分页
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [showLoading, setShowLoading] = useState(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    fetchActivityList();
  }, [current, pageSize]);

  // 初始化加载所有商品（绑定商品弹窗下拉）
  useEffect(() => {
    fetchAllGoods();
  }, []);

  // 获取秒杀活动分页列表
  const fetchActivityList = async () => {
    try {
      const searchData = searchForm.getFieldsValue();
      const params = {
        pageDTO: {
          pageNum: current,
          pageSize: pageSize,
        },
        activityName: searchData.activityName,
        status: searchData.status,
      };
      const res = await getFlashActivityList(params);
      setActivityList(res.data.list || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("加载秒杀活动失败：", err);
    }
  };

  // 获取全部上架商品（绑定商品下拉选择）
  const fetchAllGoods = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setShowLoading(true);
    try {
      const params = {
        pageDTO: { pageNum: 1, pageSize: 999 },
        queryDTO: { status: 1 },
      };
      const res = await getGoodsList(params);
      setAllGoodsList(res.data.list || []);
    } catch (err) {
      console.error("加载商品失败：", err);
    } finally {
      isLoadingRef.current = false;
      setTimeout(() => setShowLoading(false), 300);
    }
  };

  // 新增/编辑活动提交
  const handleSubmitActivity = async (values) => {
    try {
      // 时间转字符串
      values.startTime = values.startTime.format("YYYY-MM-DD HH:mm:ss");
      values.endTime = values.endTime.format("YYYY-MM-DD HH:mm:ss");
      if (isEdit) {
        await updateFlashActivity({ ...values, id: currentActivity.id });
        message.success(t("flash.editSuccess"));
      } else {
        await addFlashActivity(values);
        message.success(t("flash.addSuccess"));
      }
      setVisible(false);
      fetchActivityList();
    } catch (err) {
      console.error("保存活动失败：", err);
    }
  };

  // 删除活动
  const handleDeleteActivity = async (id) => {
    try {
      await deleteFlashActivity(id);
      message.success(t("flash.deleteSuccess"));
      fetchActivityList();
    } catch (err) {
      console.error("删除活动失败：", err);
    }
  };

  // 绑定商品到活动
  const handleBindGoods = async (values) => {
    try {
      await addFlashSaleGoods({
        activityId: currentActivity.id,
        goodsId: values.goodsId,
        flashPrice: values.flashPrice,
        discountRate: values.discountRate,
        flashStock: values.flashStock,
      });
      message.success(t("flash.bindGoodsSuccess"));
      setGoodsModalVisible(false);
    } catch (err) {
      console.error("绑定商品失败：", err);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: t("flash.activityName"),
      dataIndex: "activityName",
      width: 180,
      ellipsis: true,
    },
    {
      title: t("flash.startTime"),
      dataIndex: "startTime",
      width: 180,
    },
    {
      title: t("flash.endTime"),
      dataIndex: "endTime",
      width: 180,
    },
    {
      title: t("flash.status"),
      dataIndex: "status",
      width: 100,
      render: (s) => (
        <ShoppingState
          status={s}
          type="flash"
        />
      ),
    },
    {
      title: t("common.operation"),
      width: 260,
      render: (record) => (
        <Space>
          <ShoppingButton
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              setIsEdit(true);
              setCurrentActivity(record);
              form.setFieldsValue({
                ...record,
                startTime: dayjs(record.startTime),
                endTime: dayjs(record.endTime),
              });
              setVisible(true);
            }}
          >
            {t("btn.edit")}
          </ShoppingButton>

          <ShoppingButton
            type="text"
            onClick={() => {
              setCurrentActivity(record);
              form.resetFields([
                "goodsId",
                "flashPrice",
                "discountRate",
                "flashStock",
              ]);
              setGoodsModalVisible(true);
            }}
          >
            {t("flash.bindGoods")}
          </ShoppingButton>

          <Popconfirm
            title={t("flash.confirmDeleteActivity")}
            onConfirm={() => handleDeleteActivity(record.id)}
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
      <Card title={t("flash.manageTitle")}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Form
            form={searchForm}
            layout="inline"
            style={{ marginBottom: 16, alignItems: "center" }}
          >
            <ShoppingButton
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setIsEdit(false);
                form.resetFields();
                setVisible(true);
              }}
              style={{ marginRight: 16 }}
            >
              {t("btn.add")}
            </ShoppingButton>

            <Form.Item name="activityName">
              <Input
                placeholder={t("flash.activityNamePlaceholder")}
                style={{ width: 180 }}
              />
            </Form.Item>

            <Form.Item name="status">
              <Select
                placeholder={t("flash.statusSelect")}
                style={{ width: 140 }}
                allowClear
              >
                <Select.Option value={0}>{t("flash.status0")}</Select.Option>
                <Select.Option value={1}>{t("flash.status1")}</Select.Option>
                <Select.Option value={2}>{t("flash.status2")}</Select.Option>
              </Select>
            </Form.Item>
          </Form>

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

        <Table
          rowKey="id"
          columns={columns}
          dataSource={activityList}
          pagination={false}
          style={{ marginTop: 16 }}
          size="small"
        />
      </Card>

      {/* 新增/编辑秒杀活动弹窗 */}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.validateFields().then((v) => handleSubmitActivity(v))}
        title={isEdit ? t("btn.edit") : t("btn.add")}
        width={620}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label={t("flash.activityName")}
            name="activityName"
            rules={[
              { required: true, message: t("flash.activityNameRequired") },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("flash.startTime")}
            name="startTime"
            rules={[{ required: true, message: t("flash.startTimeRequired") }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={t("flash.endTime")}
            name="endTime"
            rules={[{ required: true, message: t("flash.endTimeRequired") }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label={t("flash.status")}
            name="status"
            rules={[{ required: true, message: t("flash.statusRequired") }]}
          >
            <Select>
              <Select.Option value={0}>{t("flash.status0")}</Select.Option>
              <Select.Option value={1}>{t("flash.status1")}</Select.Option>
              <Select.Option value={2}>{t("flash.status2")}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 绑定商品弹窗 */}
      <Modal
        open={goodsModalVisible}
        onCancel={() => setGoodsModalVisible(false)}
        onOk={() => form.validateFields().then((v) => handleBindGoods(v))}
        title={t("flash.bindGoodsTitle")}
        width={580}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label={t("flash.selectGoods")}
            name="goodsId"
            rules={[{ required: true, message: t("flash.goodsRequired") }]}
          >
            <Select
              loading={showLoading}
              placeholder={t("flash.selectGoodsPlaceholder")}
            >
              {allGoodsList.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id}
                >
                  {item.goodsName} ¥{item.price}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("flash.flashPrice")}
            name="flashPrice"
            rules={[{ required: true, message: t("flash.flashPriceRequired") }]}
          >
            <Input
              type="number"
              step="0.01"
            />
          </Form.Item>

          <Form.Item
            label={t("flash.discountRate")}
            name="discountRate"
            rules={[
              { required: true, message: t("flash.discountRateRequired") },
            ]}
          >
            <Input
              type="number"
              placeholder="如40代表原价减40%"
            />
          </Form.Item>

          <Form.Item
            label={t("flash.flashStock")}
            name="flashStock"
            rules={[{ required: true, message: t("flash.flashStockRequired") }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
