import { useState } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { addCart } from "../../../../../api/cart";

// 改成接收 goodsInfo
const ActionBar = ({ goodsInfo }) => {
  const navigate = useNavigate();

  // 加入购物车
  const handleAddCart = async () => {
    // 从 goodsInfo 里拿 id 和 price
    const goodsId = goodsInfo?.id;
    const price = goodsInfo?.price;

    if (!goodsId) {
      message.error("商品信息异常");
      return;
    }

    try {
      const res = await addCart({
        goodsId: goodsId,
        quantity: 1,
        price: price,
      });

      if (res.code === 200) {
        message.success("加入购物车成功");
      } else {
        message.error(res.msg || "加入购物车失败");
      }
    } catch (err) {
      console.error(err);
      message.error("加入购物车失败，请稍后重试");
    }
  };

  // 联系客服
  const goToChat = () => {
    navigate("/chat", {
      state: {
        // 商品ID
        goodsId: goodsInfo.id,
        // 店铺ID
        storeId: goodsInfo.storeId || 1,
      },
    });
  };

  return (
    <div className="action-bar">
      <Button
        className="contact-btn"
        onClick={goToChat}
      >
        联系客服
      </Button>
      <Button
        className="cart-btn"
        onClick={handleAddCart}
      >
        加入购物车
      </Button>
      <Button className="buy-btn">立即购买</Button>
    </div>
  );
};

export default ActionBar;
