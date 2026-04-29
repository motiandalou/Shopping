const GoodsRecommend = ({ goodsInfo }) => {
  // 后续可以拿 goodsInfo.categoryId 调用后端同类推荐接口
  const list = [
    { id: 2, name: "纯棉短裤", img: "https://picsum.photos/300/300?random=10" },
    { id: 3, name: "休闲长裤", img: "https://picsum.photos/300/300?random=11" },
  ];

  return (
    <div className="goods-recommend">
      <h2>猜你喜欢</h2>
      <div className="recommend-list">
        {list.map((item) => (
          <div
            key={item.id}
            className="rec-item"
          >
            <img
              src={item.img}
              alt=""
            />
            <div>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoodsRecommend;
