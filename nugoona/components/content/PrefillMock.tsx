'use client';

import { motion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const fields = [
  { label: '업종', value: '브런치 카페' },
  { label: '지역', value: '서울 성수동' },
  { label: '대표 메뉴', value: '리코타 팬케이크 · 에그 베네딕트' },
];
const keywords = ['성수 브런치', '성수동 카페', '브런치 맛집', '팬케이크 맛집'];

/** S8 프리필 목업 — 상호명 입력 → 네이버에서 정보 자동 채움 (제품 화면) */
export default function PrefillMock() {
  return (
    <div className="border border-border-default bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light bg-bg-alt">
        <span className="text-[12px] font-bold text-text-primary" style={EN}>스토어 세팅</span>
        <span className="text-[10px] text-text-muted">상호명만 입력</span>
      </div>

      <div className="p-5 max-md:p-4">
        {/* 입력 */}
        <label className="block text-[11px] font-medium text-text-muted mb-1.5">상호·브랜드명</label>
        <div className="flex items-center h-11 px-4 border border-accent mb-1">
          <span className="text-[14px] text-text-primary">오늘의 브런치, 성수</span>
          <span className="w-px h-4 bg-accent ml-1 animate-pulse" />
        </div>
        <p className="text-[11px] text-accent font-medium flex items-center gap-1 mb-5">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          네이버에서 자동으로 가져왔어요
        </p>

        {/* 자동 채운 필드 */}
        <div className="flex flex-col gap-2.5 mb-5">
          {fields.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.35 + i * 0.12 }}
              className="flex items-center gap-3 px-4 py-2.5 bg-bg-alt border border-border-light"
            >
              <span className="text-[11px] text-text-muted w-16 shrink-0">{f.label}</span>
              <span className="text-[13px] text-text-primary font-medium">{f.value}</span>
            </motion.div>
          ))}
        </div>

        {/* 추천 키워드 */}
        <p className="text-[11px] font-medium text-text-muted mb-2">검색에 쓸 키워드도 골라 뒀어요</p>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((k, i) => (
            <motion.span
              key={k}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.75 + i * 0.08 }}
              className="text-[12px] px-2.5 py-1 border border-accent-border bg-accent-bg text-accent font-medium"
            >
              {k}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
