const GoodsReview = () => {
  const reviews = [
    { name: "张三", content: "质量很好，面料舒服", time: "2025-01-01" },
    { name: "李四", content: "发货很快，推荐购买", time: "2025-01-02" },
  ];

  return (
    <div className="goods-review">
      <h2>用户评价</h2>
      {reviews.map((r, i) => (
        <div
          key={i}
          className="review-item"
        >
          <div>{r.name}</div>
          <div>{r.content}</div>
          <div>{r.time}</div>
        </div>
      ))}
    </div>
  );
};

export default GoodsReview;
