'use client';

import { motion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const ranks = [
  { kw: '성수 브런치', pos: 3, chg: 2 },
  { kw: '성수동 카페', pos: 5, chg: 1 },
  { kw: '브런치 맛집', pos: 8, chg: 4 },
];
const months = [30, 38, 44, 52, 58, 66];

/** S7 노출 증명 목업 — 검색어 순위 추적 + 월간 노출 증가 (제품 화면) */
export default function ProofMock() {
  return (
    <div className="border border-border-default bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.03)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light bg-bg-alt">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-text-primary" style={EN}>노출 리포트 · 이번 달</span>
          <span className="rounded-dot w-2 h-2 bg-[#22c55e]" />
        </div>
        <span className="text-[10px] text-text-muted" style={EN}>매일 순위 확인</span>
      </div>

      <div className="p-5 max-md:p-4">
        {/* 순위 추적 */}
        <p className="text-[10px] font-semibold text-text-muted tracking-[0.08em] uppercase mb-3" style={EN}>검색어 순위</p>
        <div className="flex flex-col">
          {ranks.map((r, i) => (
            <motion.div
              key={r.kw}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.12 }}
              className="flex items-center gap-3 py-2.5 border-b border-border-light last:border-b-0"
            >
              <span className="text-[13px] text-text-primary flex-1">{r.kw}</span>
              <span className="text-[13px] font-bold text-text-primary" style={EN}>{r.pos}위</span>
              <span className="text-[11px] font-semibold text-[#22c55e] w-9 text-right" style={EN}>▲ {r.chg}</span>
            </motion.div>
          ))}
        </div>

        {/* 월간 노출 */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <p className="text-[10px] font-semibold text-text-muted tracking-[0.08em] uppercase" style={EN}>월간 노출</p>
          <span className="text-[11px] font-semibold text-[#22c55e]" style={EN}>▲ 꾸준히 증가</span>
        </div>
        <div className="flex items-end gap-1.5 h-[56px]">
          {months.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 + i * 0.07 }}
              className={i === months.length - 1 ? 'flex-1 bg-accent' : 'flex-1 bg-accent/20'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
