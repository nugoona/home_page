'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   목업 시안 A — "부상" (세련된 추상 애니메이션)
   "검색에 보인다"를 진짜 네이버 흉내 없이 전달: 익명의 흐린 결과 바들 사이에서
   '내 가게' 하나만 또렷해지며 맨 위로 스르륵 올라간다(layout 애니메이션).
   텍스트는 '내 가게' 라벨 하나뿐 — 문장을 UI로 번역하지 않는다.
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GREEN = '#2fd46b';

const INITIAL = ['a', 'b', 'mine', 'c', 'd'];
const RISEN = ['mine', 'a', 'b', 'c', 'd'];

export default function ExposureMockA() {
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
    <div ref={ref} className="w-full h-full flex flex-col justify-center gap-2 px-1">
      {order.map((id) => {
        const mine = id === 'mine';
        return (
          <motion.div
            layout
            key={id}
            transition={{ layout: { duration: 0.7, ease: EASE } }}
            className="flex items-center gap-3 border px-4"
            style={{
              height: 46,
              borderColor: mine && risen ? GREEN : '#eaeaea',
              background: mine && risen ? 'rgba(47,212,107,0.06)' : '#fff',
              boxShadow: mine && risen ? `0 8px 24px rgba(47,212,107,0.14)` : 'none',
            }}
          >
            {/* 순위 점 / 핀 */}
            <span
              className="shrink-0 flex items-center justify-center"
              style={{ width: 8, height: 8 }}
            >
              <span
                className="rounded-dot"
                style={{
                  width: mine && risen ? 8 : 5,
                  height: mine && risen ? 8 : 5,
                  background: mine && risen ? GREEN : '#d4d4d4',
                  transition: 'all 0.4s',
                }}
              />
            </span>

            {mine ? (
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-[14px] font-semibold whitespace-nowrap"
                  style={{ color: risen ? '#171717' : '#999' }}
                >
                  내 가게
                </span>
                {risen && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold"
                    style={{ color: GREEN, fontFamily: 'var(--font-en)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 8V2M5 2L2 5M5 2l3 3" />
                    </svg>
                    TOP
                  </motion.span>
                )}
              </div>
            ) : (
              /* 익명 결과 = 흐린 플레이스홀더 바 2줄(텍스트 없음) */
              <div className="flex flex-col gap-1.5 min-w-0 flex-1 opacity-50">
                <span className="block h-[6px] w-[55%]" style={{ background: '#e2e2e2' }} />
                <span className="block h-[6px] w-[35%]" style={{ background: '#ececec' }} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
