'use client';

/**
 * S10_RankTrack — [/content ⑤ 순위 증명, 정본 A13] 시안 D5(Draft_CoreSet.tsx) 뼈대를 실컴포넌트로 번역 + 브랜드 모션.
 * 구조 고정(D5 그대로 — 글자·항목 추가 금지): 리드 문장 → 초대형 측정값(카운트업) → 계단 변화 → 칩 2개 → 각주 1줄.
 * ⛔ "1위/상위노출 보장" 금지 — 측정·표시만. "2페이지 14위" 같은 측정값·변화(계단)는 정본 허용(A13).
 * ⛔ "순위 오르면 알림" 금지 — A13 정본은 하락 경고만.
 * 옛 2열 앱 UI(검색결과 창 + 순위 패널)는 폐기(사장님 "앱 UI 폐기" 승인, 2026-07-11).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CounterUp from '@/components/motion/CounterUp';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
const BORDER = '#eaeaea';

export default function S10_RankTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });

  return (
    <div ref={ref} className="w-full max-w-[640px]">
      {/* 리드 문장 */}
      <motion.p
        className="text-[13px] text-text-body mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="font-bold text-accent">&ldquo;홍대 미용실&rdquo;</span>로 검색하면, <span className="font-bold text-text-primary">결헤어 홍대점</span>은 지금
      </motion.p>

      {/* 초대형 측정값 + 계단 변화 */}
      <motion.div
        className="flex items-baseline gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
      >
        <span className="text-[clamp(40px,6vw,72px)] font-bold text-text-primary tracking-[-0.03em] leading-none" style={EN}>
          <CounterUp target={14} prefix="2페이지 " suffix="위" duration={900} />
        </span>
        <motion.span
          className="text-[clamp(16px,2vw,22px)] font-bold"
          style={{ ...EN, color: '#16a34a' }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 0.45 }}
        >
          ▲ 3계단
        </motion.span>
      </motion.div>

      {/* 칩 2개 */}
      <div className="flex gap-2 mt-5 flex-wrap">
        <motion.span
          className="text-[11px] px-2 py-1 border"
          style={{ borderColor: BORDER }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}
        >
          홍대 펌 — <b>1페이지</b>
        </motion.span>
        <motion.span
          className="text-[11px] px-2 py-1 border text-text-weak"
          style={{ borderColor: BORDER }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE, delay: 0.7 }}
        >
          연남동 미용실 — 곧 확인해요
        </motion.span>
      </div>

      {/* 각주 1줄 */}
      <motion.p
        className="mt-4 text-[11px] text-text-weak"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
      >
        매일 아침 7시 40분, 네이버·구글 네 곳에서 잽니다. 떨어지면 알려드립니다.
      </motion.p>
    </div>
  );
}
