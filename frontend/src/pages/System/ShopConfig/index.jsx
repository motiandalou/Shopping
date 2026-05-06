import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Switch,
  Tabs,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  getShopConfigApi,
  addShopConfigApi,
  updateShopConfigApi,
} from "@/api/shopConfigApi";
import { useEffect, useState } from "react";

export default function ShopSetting() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 加载店铺配置
  useEffect(() => {
    getShopConfigApi().then((res) => {
      if (res.data) {
        form.setFieldsValue(res.data);
      }
    });
  }, [form]);

  // 保存
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const submitData = {
        ...values,
        id: form.getFieldValue("id"),
        autoAgreeAfterSale: values.autoAgreeAfterSale ? 1 : 0,
        newOrderPushNotice: values.newOrderPushNotice ? 1 : 0,
      };

      // 得到店铺配置是否已经存在，如果存在则调用修改接口，否则调用添加接口
      const res = await getShopConfigApi();

      if (res.data) {
        // 更新接口
        await updateShopConfigApi(submitData);
      } else {
        // 新增接口
        await addShopConfigApi(submitData);
      }

      message.success(t("common.saveSuccess"));
    } catch (err) {
      console.error("err:", err);
      message.error(t("common.saveFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={t("shopSetting.title")}
      bordered={false}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: t("shopSetting.tab.basic"),
            children: (
              <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
              >
                <Form.Item
                  name="id"
                  hidden
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.shopName")}
                  name="shopName"
                >
                  <Input placeholder={t("shopSetting.placeholder.shopName")} />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.contactPhone")}
                  name="contactPhone"
                >
                  <Input
                    placeholder={t("shopSetting.placeholder.contactPhone")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.shopAddress")}
                  name="shopAddress"
                >
                  <Input
                    placeholder={t("shopSetting.placeholder.shopAddress")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.businessHours")}
                  name="businessHours"
                >
                  <Input
                    placeholder={t("shopSetting.placeholder.businessHours")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.shopIntro")}
                  name="shopIntro"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder={t("shopSetting.placeholder.shopIntro")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.freeShippingThreshold")}
                  name="freeShippingThreshold"
                >
                  <InputNumber
                    placeholder={t(
                      "shopSetting.placeholder.freeShippingThreshold",
                    )}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    loading={loading}
                  >
                    {t("common.save")}
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: "2",
            label: t("shopSetting.tab.order"),
            children: (
              <Form
                form={form}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                <Form.Item
                  label={t("shopSetting.unpaidTimeoutMinutes")}
                  name="unpaidTimeoutMinutes"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t("shopSetting.placeholder.default15")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.autoConfirmReceiveDays")}
                  name="autoConfirmReceiveDays"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t("shopSetting.placeholder.default7")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.afterSaleApplyDays")}
                  name="afterSaleApplyDays"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={t("shopSetting.placeholder.default7")}
                  />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.autoAgreeAfterSale")}
                  name="autoAgreeAfterSale"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label={t("shopSetting.newOrderPushNotice")}
                  name="newOrderPushNotice"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    loading={loading}
                  >
                    {t("common.save")}
                  </Button>
                </Form.Item>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
}
