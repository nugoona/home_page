'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   콘텐츠 카드 목업 = 실제 "누구나 콘텐츠" 앱의 "내 가게 노출" 카드 재현
   (원본: ngn_upload/src/components/HomeExposureCards.tsx + HomeExposureCards.module.css,
    라벨 규칙: src/lib/exposure-label.ts — 값·색·라운딩을 1:1로 옮김).
   짝퉁 UI가 아니라 우리 제품의 실제 화면. 데이터만 가상 업체(성수동 브런치 카페)로 교체.
   ⛔ 순위는 '현황 측정 표시'(제품 실체, A13) — 실제 앱처럼 "등수 신경 쓰지 마세요" 문구 동반.
      홈 카피로 순위를 강조하지 않는다(사장님 확정 2026-07-12).
   ═══════════════════════════════════════════════════════════════ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Tone = 'strong' | 'ok' | 'weak' | 'none';
const TONE: Record<Tone, { background: string; color: string }> = {
  strong: { background: '#0070f3', color: '#fff' },
  ok: { background: '#eaf3ff', color: '#0070f3' },
  weak: { background: '#f1f1f4', color: '#4a4a52' },
  none: { background: '#f1f1f4', color: '#7a7a82' },
};

/* 가상 업체 데이터 — exposure-label.ts 규칙대로(≤10위 "N위", 11~ "N페이지") */
const ROWS: { kw: string; chip: string; tone: Tone; sub?: string }[] = [
  { kw: '성수동 브런치', chip: '플레이스 3위', tone: 'strong' },
  { kw: '성수 브런치카페', chip: '플레이스 6위', tone: 'strong', sub: '블로그 2페이지' },
  { kw: '성수동 아침식사', chip: '플레이스 2페이지', tone: 'ok' },
  { kw: '성수동 카페 추천', chip: '곧 확인해요', tone: 'none' },
];

export default function ExposureAppMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center px-4 py-4">
      {/* 실제 앱 카드(HomeExposureCards .card) 1:1 */}
      <div
        className="w-full"
        style={{
          maxWidth: 380,
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 1px 4px rgba(20,20,24,0.06)',
          padding: '20px 20px 16px',
          fontFamily: 'Pretendard, var(--font-kr, sans-serif)',
        }}
      >
        {/* head */}
        <div className="flex items-baseline justify-between">
          <span style={{ fontSize: 18, fontWeight: 800, color: '#17171c', letterSpacing: '-0.5px' }}>내 가게 노출</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#7a7a82' }}>매일 아침 확인</span>
        </div>

        {/* 키워드 행들 */}
        <div style={{ marginTop: 4 }}>
          {ROWS.map((r, i) => (
            <motion.div
              key={r.kw}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.14 }}
              style={{ padding: '11px 0', borderTop: i === 0 ? 'none' : '1px solid #f0f0f3' }}
            >
              {/* 위: 검색어 + N 네이버 */}
              <div className="flex items-center justify-between" style={{ gap: 12 }}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 700, color: '#17171c' }}>{r.kw}</span>
                <span
                  className="inline-flex items-center"
                  style={{ gap: 6, padding: '7px 11px', border: '1.5px solid #d6d6db', borderRadius: 999, fontSize: 12.5, fontWeight: 700, color: '#17171c' }}
                >
                  <span
                    className="inline-flex items-center justify-center"
                    style={{ width: 15, height: 15, background: '#03c75a', color: '#fff', fontSize: 10, fontWeight: 900, borderRadius: 4 }}
                  >
                    N
                  </span>
                  네이버
                </span>
              </div>
              {/* 아래: 상태 칩 */}
              <div className="flex items-center" style={{ gap: 7, marginTop: 8 }}>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.35, ease: EASE, delay: i * 0.14 + 0.2 }}
                  style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.3px', padding: '5px 11px', borderRadius: 6, whiteSpace: 'nowrap', ...TONE[r.tone] }}
                >
                  {r.chip}
                </motion.span>
                {r.sub && <span style={{ fontSize: 12.5, fontWeight: 600, color: '#7a7a82' }}>/ {r.sub}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* effortNote — 실제 앱 문구(순위 등수 강조 안 함) */}
        <div
          style={{ marginTop: 12, padding: '11px 12px', background: '#f4f6f8', borderLeft: '3px solid #0070f3', fontSize: 12.5, lineHeight: 1.5, color: '#44444c', letterSpacing: '-0.01em' }}
        >
          순위 등수는 신경 쓰지 않으셔도 돼요. 꾸준히 올릴수록 검색에 보이는 키워드가 늘어요.
        </div>
      </div>
    </div>
  );
}
