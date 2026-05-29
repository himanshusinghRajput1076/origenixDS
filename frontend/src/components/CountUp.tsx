import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number; // in seconds
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, start = 0, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(start);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuad = (x: number): number => 1 - (1 - x) * (1 - x); // Smooth deceleration curve
      
      const currentCount = Math.floor(start + easeOutQuad(progress) * (end - start));
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure we end at exactly the target value
        animatedRef.current = true;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animationFrameId = window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
    };
  }, [end, start, duration]);

  return (
    <span ref={elementRef} className="custom-countup">
      {count}
      {suffix}
    </span>
  );
};

export default CountUp;
