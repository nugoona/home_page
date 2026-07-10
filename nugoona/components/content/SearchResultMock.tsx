'use client';

import { motion } from 'framer-motion';
import BrowserFrame from '@/components/ui/BrowserFrame';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/** 히어로 목업 — 네이버 검색 결과에 '내 스토어'가 잡힌 화면 (열망 시각화) */
export default function SearchResultMock() {
  return (
    <BrowserFrame url="search.naver.com" alt>
      <div className="p-5 h-full flex flex-col bg-white max-md:p-4">
        {/* 검색창 */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#03c75a] mb-4">
          <span className="text-[13px] text-text-primary flex-1" style={EN}>성수동 브런치 카페</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#03c75a" strokeWidth="1.75">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
        </div>

        {/* 결과 */}
        <div className="flex flex-col gap-2.5 flex-1">
          {/* #1 — 내 스토어 (강조 + 등장) */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="relative border border-accent bg-accent-bg px-4 py-3"
          >
            <span className="absolute top-3 right-3 text-[9px] font-semibold text-white bg-accent px-2 py-0.5" style={EN}>
              MY STORE
            </span>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
              <span className="text-[14px] font-semibold text-text-primary">오늘의 브런치, 성수</span>
            </div>
            <p className="text-[11px] text-text-body leading-relaxed">
              성수동 · 브런치 카페 · 리뷰 214 · “오늘 신메뉴 나왔어요”
            </p>
          </motion.div>

          {/* 경쟁 결과 (흐림) */}
          {['○○ 카페', '△△ 브런치하우스'].map((name, i) => (
            <div key={i} className="border border-border-light px-4 py-3 opacity-60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-dot w-1.5 h-1.5 bg-[#ccc]" />
                <span className="text-[13px] font-medium text-text-muted">{name}</span>
              </div>
              <span className="block h-1.5 w-3/4 bg-[#ededed]" />
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
