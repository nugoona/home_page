'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export default function CounterUp({
  target,
  suffix = '',
  prefix = '',
  duration = 1200,
  decimals = 0,
  className,
}: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView) return;

    const start = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      setDisplay(
        `${prefix}${decimals > 0 ? current.toFixed(decimals) : Math.round(current)}${suffix}`
      );
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [inView, target, suffix, prefix, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
