import { useState, useEffect } from "react";
import { Tag, Select } from "antd";
import "./index.less";

const GoodsHeader = ({ goodsInfo }) => {
  const info = goodsInfo || {};

  return (
    <div className="jd-goods-header">
      {/* 商品标题 */}
      <h1 className="jd-goods-name">{info.goodsName || info.name}</h1>

      {/* 价格区域（京东风格） */}
      <div className="jd-price-box">
        <div className="jd-price-main">
          <span className="jd-price-symbol">¥</span>
          <span className="jd-price">{info.price}</span>
          <span className="jd-market-price">¥{info.marketPrice}</span>
          <Tag
            color="red"
            className="jd-hot-tag"
          >
            热销爆款
          </Tag>
        </div>
        <div className="jd-price-tip">
          限时优惠，立省 ¥{info.marketPrice - info.price}
        </div>
      </div>

      {/* 销量/库存 */}
      <div className="jd-info-row">
        <span>销量：{info.sales || "0"}+</span>
        <span>库存：{info.stock} 件</span>
      </div>
    </div>
  );
};

export default GoodsHeader;
