import { useState, useEffect, useRef } from "react";

const CountUp = ({ end = 0, prefix = "", suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    if (end === 0 || end === undefined || end === null) {
      setDisplay(0);
      return;
    }

    const start = startRef.current;
    const diff = end - start;
    const durationPer100 = 800; // 每100个数字用时 800ms
    const totalDuration = Math.max(
      300,
      (Math.abs(diff) / 100) * durationPer100,
    ); // 最小300ms

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const current = start + diff * easeProgress;
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
