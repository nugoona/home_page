'use client';

import { motion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const changes = [
  { dot: '#03c75a', text: '네이버, 경험 담긴 후기 글을 검색 위로 올림', tag: '반영됨' },
  { dot: '#4285f4', text: '“성수 브런치” 연관 검색어 상승', tag: '반영됨' },
  { dot: '#8b5cf6', text: '지도 검색 노출 비중 증가', tag: '반영됨' },
];
// 노출 순위 상승(값이 클수록 상위) 스파크라인용
const rankBars = [30, 34, 40, 44, 52, 60, 66];

/** /content S5 — 노출 소식 주간 수집 → 다음 글 반영 → 노출 상승 (제품 화면 재현) */
export default function NewsReflectMock() {
  return (
    <div className="border border-white/10 bg-[#0f0f0f] text-left shadow-[0_28px_80px_rgba(0,0,0,0.5)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-white" style={EN}>노출 소식 · 주간 리포트</span>
          <span className="rounded-dot w-2 h-2 bg-[#22c55e]" />
        </div>
        <span className="text-[10px] text-white/40" style={EN}>주 1회 자동 수집</span>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1">
        {/* 좌: 감지된 변화 */}
        <div className="p-6 border-r border-white/10 max-md:border-r-0 max-md:border-b">
          <p className="text-[11px] font-semibold text-white/40 tracking-[0.08em] uppercase mb-4" style={EN}>
            이번 주 감지된 변화
          </p>
          <div className="flex flex-col gap-3">
            {changes.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3"
              >
                <span className="rounded-dot w-2 h-2 shrink-0" style={{ background: c.dot }} />
                <span className="text-[13px] text-white/80 leading-snug flex-1">{c.text}</span>
                <span className="text-[10px] font-semibold text-[#22c55e] border border-[#22c55e]/30 px-1.5 py-0.5 shrink-0" style={EN}>
                  {c.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 우: 내 스토어 노출 추이 (상승) */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold text-white/40 tracking-[0.08em] uppercase" style={EN}>
              내 스토어 노출
            </p>
            <span className="text-[11px] font-semibold text-[#22c55e]" style={EN}>▲ 꾸준히 노출 중</span>
          </div>
          <div className="flex items-end gap-1.5 h-[92px]">
            {rankBars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 + i * 0.07 }}
                className={i === rankBars.length - 1 ? 'flex-1 bg-[#22c55e]' : 'flex-1 bg-white/15'}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-white/30" style={EN}>
            <span>4주 전</span><span>이번 주</span>
          </div>
        </div>
      </div>

      {/* 하단: 다음 글 반영 */}
      <div className="flex items-center gap-2.5 px-6 py-3.5 border-t border-white/10 bg-white/[0.02]">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="1.5">
          <circle cx="8" cy="8" r="3" /><path d="M8 2v2M8 12v2M2 8h2M12 8h2" strokeLinecap="round" />
        </svg>
        <span className="text-[12px] text-white/70">모은 소식을 <span className="text-accent font-semibold">앞으로 쓰는 글에 자동 반영</span> — 흐름을 놓치지 않습니다.</span>
      </div>
    </div>
  );
}
