const GoodsDesc = ({ goodsInfo }) => {
  return (
    <div className="goods-desc">
      <h2>商品详情</h2>
      <div className="desc-content">
        <img
          src={
            goodsInfo?.descImg || "https://picsum.photos/1000/2000?random=10"
          }
          alt="商品详情"
          style={{ width: "100%", display: "block" }}
        />
      </div>
    </div>
  );
};

export default GoodsDesc;
