import { Carousel } from "antd";

// 接收 goodsInfo，不再用 goodsId
const GoodsMedia = ({ goodsInfo }) => {
  // 默认图兜底（防止后端没图片时不报错）
  const defaultImages = [
    "https://picsum.photos/800/800?random=1",
    "https://picsum.photos/800/800?random=2",
    "https://picsum.photos/800/800?random=3",
  ];

  const imageList = goodsInfo?.imgList
    ? goodsInfo.imgList
    : goodsInfo?.coverImg
      ? [goodsInfo.coverImg]
      : defaultImages;

  return (
    <div className="goods-media">
      <Carousel
        autoplay
        dots
      >
        {imageList.map((img, i) => (
          <div key={i}>
            <img
              src={img}
              alt="商品图片"
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default GoodsMedia;
