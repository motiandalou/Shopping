import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GoodsHeader from "./components/GoodsHeader";
import GoodsMedia from "./components/GoodsMedia";
import GoodsService from "./components/GoodsService";
import GoodsDesc from "./components/GoodsDesc";
import GoodsReview from "./components/GoodsReview";
import GoodsRecommend from "./components/GoodsRecommend";
import ActionBar from "./components/ActionBar";
import { getGoodsDetail } from "../../../api/goods";
import "./index.less";

const GoodsDetail = () => {
  const { id } = useParams();
  const [goodsInfo, setGoodsInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 页面一加载 → 请求1次详情
  useEffect(() => {
    if (!id) return;
    loadDetailData();
  }, [id]);

  // 请求详情接口（只发一次！）
  const loadDetailData = async () => {
    try {
      const res = await getGoodsDetail(id);
      if (res.code === 200) {
        setGoodsInfo(res.data);
      }
    } catch (err) {
      console.log("获取详情失败", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>加载中...</div>
    );
  if (!goodsInfo) return <div>商品不存在</div>;

  return (
    <div className="jd-detail-container">
      <div className="jd-detail-main">
        <div className="jd-detail-left">
          <GoodsMedia goodsInfo={goodsInfo} />
          <GoodsService goodsInfo={goodsInfo} />
          <GoodsDesc goodsInfo={goodsInfo} />
          <GoodsReview goodsInfo={goodsInfo} />
          <GoodsRecommend goodsInfo={goodsInfo} />
        </div>

        <div className="jd-detail-right">
          <GoodsHeader goodsInfo={goodsInfo} />
          <ActionBar goodsInfo={goodsInfo} />
        </div>
      </div>
    </div>
  );
};

export default GoodsDetail;
