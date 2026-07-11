'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   목업 시안 B — "핵심 한 줄" (짧은 텍스트 + 절제된 미니 그래픽)
   "검색에 보인다"를 숫자 하나로: 노출 순위가 3위 → 1위로 올라가고,
   옆의 미니 막대 3개가 순차로 차오른다. 화면 재현 없음, 텍스트 최소.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GREEN = '#2fd46b';

export default function ExposureMockB() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [rank, setRank] = useState(3);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setGo(true);
      const controls = animate(3, 1, {
        duration: 1.1,
        ease: EASE,
        onUpdate: (v) => setRank(Math.round(v)),
      });
      return () => controls.stop();
    }, 500);
    return () => clearTimeout(t);
  }, [inView]);

  /* 막대 3개: 왼→오 점점 높아지고, 마지막(내 가게)이 그린 */
  const bars = [
    { h: 34, delay: 0 },
    { h: 52, delay: 0.12 },
    { h: 78, delay: 0.24, mine: true },
  ];

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-between gap-6 px-5">
      {/* 왼쪽 — 핵심 숫자 */}
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-text-weak mb-1">검색 노출 순위</span>
        <div className="flex items-end gap-2">
          <span
            className="text-[56px] font-bold leading-none tracking-[-0.03em]"
            style={{ color: go && rank === 1 ? GREEN : '#171717', fontFamily: 'var(--font-en)', transition: 'color 0.4s' }}
          >
            {rank}
          </span>
          <span className="text-[20px] font-semibold text-text-body mb-1.5">위</span>
        </div>
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={go ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.4, ease: EASE }}
          className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold"
          style={{ color: GREEN, fontFamily: 'var(--font-en)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 10V3M6 3L3 6M6 3l3 3" />
          </svg>
          3위 → 1위
        </motion.span>
      </div>

      {/* 오른쪽 — 미니 상승 막대 */}
      <div className="flex items-end gap-2" style={{ height: 88 }}>
        {bars.map((b, i) => (
          <motion.span
            key={i}
            initial={{ height: 6 }}
            animate={go ? { height: b.h } : {}}
            transition={{ delay: 0.4 + b.delay, duration: 0.6, ease: EASE }}
            className="block w-4"
            style={{ background: b.mine ? GREEN : '#e2e2e2' }}
          />
        ))}
      </div>
    </div>
  );
}
