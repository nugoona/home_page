'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BrowserFrame from '@/components/ui/BrowserFrame';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/* 순위 추적 테이블 (완성 전제 데모값) */
const rows = [
  { kw: '미금역 치과', ch: '블로그탭', rank: 2, delta: 3 },
  { kw: '분당 임플란트', ch: '플레이스', rank: 1, delta: 1 },
  { kw: '정자동 교정', ch: '통합검색', rank: 4, delta: 2 },
];

/**
 * S5 콘텐츠(노출) 제품 목업 — 대안 A (신규, 원본 마이크로 자산 재스킨)
 * 네이버 검색결과에 내 스토어가 잡힌 화면(BrowserFrame) + 순위추적 플로팅 카드(타이틀패널·테이블·AIAnalysis)
 */
export default function RankTrackMock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative max-w-[460px] mx-auto">
      {/* 검색결과 브라우저 */}
      <BrowserFrame url="search.naver.com" alt>
        <div className="p-5 h-full flex flex-col bg-white max-md:p-4">
          <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#03c75a] mb-4">
            <span className="text-[13px] text-text-primary flex-1" style={EN}>미금역 치과</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#03c75a" strokeWidth="1.75">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M11 11l3 3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col gap-2.5 flex-1">
            {/* #1 — 내 스토어 */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              className="relative border border-accent bg-accent-bg px-4 py-3"
            >
              <span className="absolute top-3 right-3 text-[9px] font-semibold text-white bg-accent px-2 py-0.5" style={EN}>
                MY STORE
              </span>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
                <span className="text-[14px] font-semibold text-text-primary">미금 화이트치과의원</span>
              </div>
              <p className="text-[11px] text-text-body leading-relaxed">
                분당 미금역 2번 출구 · 리뷰 328 · “이번 주 신규 이벤트”
              </p>
            </motion.div>
            {/* 경쟁 결과 (흐림) */}
            {['○○치과의원', '△△덴탈클리닉'].map((n, i) => (
              <div key={i} className="border border-border-light px-4 py-3 opacity-60">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="rounded-dot w-1.5 h-1.5 bg-[#ccc]" />
                  <span className="text-[13px] font-medium text-text-muted">{n}</span>
                </div>
                <span className="block h-1.5 w-3/4 bg-[#ededed]" />
              </div>
            ))}
          </div>
        </div>
      </BrowserFrame>

      {/* 순위추적 플로팅 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
        className="mt-4 w-full bg-white border border-border-default shadow-[0_16px_40px_rgba(0,0,0,0.10)]"
      >
        {/* 타이틀 패널 */}
        <div className="px-4 py-2.5 bg-[#f0f0f0] flex items-center justify-between">
          <span className="text-[10px] font-semibold text-[#555] tracking-[0.06em] uppercase" style={EN}>Rank Tracking</span>
          <span className="text-[9px] text-[#999]" style={EN}>매일 07:40</span>
        </div>
        {/* 테이블 */}
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-text-primary truncate">{r.kw}</p>
                <p className="text-[9px] text-text-weak">{r.ch}</p>
              </div>
              <span className="text-[15px] font-bold text-text-primary leading-none" style={EN}>
                {r.rank}<span className="text-[9px] font-medium text-text-weak ml-0.5">위</span>
              </span>
              <span className="text-[10px] font-semibold text-[#22c55e] w-[26px] text-right" style={EN}>▲{r.delta}</span>
            </div>
          ))}
        </div>
        {/* AI 인사이트 */}
        <div className="mx-4 mb-3 pl-2.5 border-l-2 border-accent">
          <p className="text-[10px] text-[#555] leading-[1.6]">
            이번 주 <b className="font-semibold text-text-primary">‘미금역 치과’</b> 노출이 3계단 올랐습니다.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
