import { useState, useEffect, useRef } from "react";

const CountUp = ({ end = 0, prefix = "", suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const rafId = useRef(null);

  // 固定 2 秒跑完！不管 end 是 1 还是 100万 还是 1亿
  const FIXED_DURATION = 2000;

  useEffect(() => {
    if (end === 0 || end === undefined || end === null) {
      setDisplay(0);
      return;
    }

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      // 核心：只算时间进度，不看数字大小
      const progress = Math.min(elapsed / FIXED_DURATION, 1);
      // 缓动动画
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      // 直接按进度计算当前数字
      const current = end * easeProgress;

      setDisplay(
        Number.isInteger(end) ? Math.floor(current) : current.toFixed(2),
      );

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId.current);
  }, [end]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
