const GoodsService = () => {
  const services = ["7天无理由退货", "正品保障", "免运费", "48小时发货"];

  return (
    <div className="goods-service">
      {services.map((s, i) => (
        <span
          key={i}
          className="service-item"
        >
          {s}
        </span>
      ))}
    </div>
  );
};

export default GoodsService;
