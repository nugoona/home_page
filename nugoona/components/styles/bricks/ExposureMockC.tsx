'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   목업 시안 C — "혼합" (부상 애니메이션 + 짧은 순위 라벨)
   A의 '내 가게 부상'에 B의 '핵심 한 줄(3위→1위)'을 얹었다.
   흐린 결과 3줄 위로 내 가게가 올라오고, 상단에 순위 배지가 뜬다.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GREEN = '#2fd46b';

const INITIAL = ['a', 'b', 'mine', 'c'];
const RISEN = ['mine', 'a', 'b', 'c'];

export default function ExposureMockC() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setRisen(true), 550);
    return () => clearTimeout(t);
  }, [inView]);

  const order = risen ? RISEN : INITIAL;

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-center gap-3 px-2">
      {/* 상단 — 핵심 한 줄 */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[13px] font-medium text-text-weak">검색 노출</span>
        <motion.span
          initial={{ opacity: 0, x: 6 }}
          animate={risen ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.4, ease: EASE }}
          className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[12px] font-semibold"
          style={{ color: GREEN, borderColor: GREEN, fontFamily: 'var(--font-en)' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={GREEN} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8V2M5 2L2 5M5 2l3 3" />
          </svg>
          3위 → 1위
        </motion.span>
      </div>

      {/* 결과 리스트 — 내 가게 부상 */}
      <div className="flex flex-col gap-2">
        {order.map((id) => {
          const mine = id === 'mine';
          return (
            <motion.div
              layout
              key={id}
              transition={{ layout: { duration: 0.7, ease: EASE } }}
              className="flex items-center gap-3 border px-4"
              style={{
                height: 42,
                borderColor: mine && risen ? GREEN : '#eaeaea',
                background: mine && risen ? 'rgba(47,212,107,0.06)' : '#fff',
                boxShadow: mine && risen ? '0 8px 24px rgba(47,212,107,0.14)' : 'none',
              }}
            >
              <span
                className="rounded-dot shrink-0"
                style={{
                  width: mine && risen ? 8 : 5,
                  height: mine && risen ? 8 : 5,
                  background: mine && risen ? GREEN : '#d4d4d4',
                  transition: 'all 0.4s',
                }}
              />
              {mine ? (
                <span className="text-[14px] font-semibold" style={{ color: risen ? '#171717' : '#999' }}>
                  내 가게
                </span>
              ) : (
                <div className="flex flex-col gap-1.5 flex-1 opacity-50">
                  <span className="block h-[6px] w-[52%]" style={{ background: '#e2e2e2' }} />
                  <span className="block h-[6px] w-[32%]" style={{ background: '#ececec' }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
