'use client';

import { motion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/** S6 지도·플레이스 노출 목업 — 네이버 지도/플레이스 검색에 내 가게가 뜬 화면 (CSS 추상 지도) */
export default function MapMock() {
  return (
    <div className="border border-border-default bg-white overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.03)]">
      {/* 헤더 — 검색 + 탭 */}
      <div className="px-5 py-3.5 border-b border-border-light bg-bg-alt">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#03c75a] mb-2.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#03c75a" strokeWidth="1.75"><circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" /></svg>
          <span className="text-[12px] text-text-primary" style={EN}>성수동 브런치 카페</span>
        </div>
        <div className="flex gap-4">
          {['네이버 지도', '플레이스', '구글 지도'].map((t, i) => (
            <span key={t} className={i === 0 ? 'text-[11px] font-semibold text-text-primary border-b-2 border-[#03c75a] pb-0.5' : 'text-[11px] text-text-weak pb-0.5'}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[3fr_2fr] max-sm:grid-cols-1">
        {/* 좌: 추상 지도 */}
        <div className="relative h-[280px] max-sm:h-[200px] border-r border-border-light max-sm:border-r-0 max-sm:border-b overflow-hidden" style={{ background: '#eef1ec' }}>
          {/* 도로 격자 */}
          <div className="absolute inset-0" style={{
            backgroundImage:
              'linear-gradient(0deg, transparent 47%, #fff 47%, #fff 53%, transparent 53%), linear-gradient(90deg, transparent 47%, #fff 47%, #fff 53%, transparent 53%)',
            backgroundSize: '84px 84px',
            opacity: 0.9,
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(35deg, transparent 48.5%, #fff 48.5%, #fff 51.5%, transparent 51.5%)',
            backgroundSize: '160px 160px',
            opacity: 0.7,
          }} />
          {/* 블록(면) */}
          {[[12, 14], [64, 20], [16, 60], [70, 66]].map(([l, t], i) => (
            <div key={i} className="absolute" style={{ left: `${l}%`, top: `${t}%`, width: 34, height: 26, background: 'rgba(0,0,0,0.035)' }} />
          ))}

          {/* 경쟁 핀 (흐림) */}
          {[[30, 62], [72, 34]].map(([l, t], i) => (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${l}%`, top: `${t}%` }}>
              <div className="rounded-dot w-3 h-3 bg-[#bbb] border-2 border-white shadow-sm" />
            </div>
          ))}

          {/* 내 가게 핀 (accent 강조 + 펄스) */}
          <div className="absolute -translate-x-1/2 -translate-y-full" style={{ left: '48%', top: '46%' }}>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
              className="relative flex flex-col items-center"
            >
              <span className="text-[10px] font-bold text-white bg-accent px-2 py-0.5 whitespace-nowrap mb-1 shadow-[0_2px_8px_rgba(0,112,243,0.4)]" style={EN}>MY STORE</span>
              <span className="rounded-dot w-4 h-4 bg-accent border-[2.5px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.25)]" />
              <span className="absolute bottom-0 rounded-dot w-4 h-4 bg-accent animate-ping opacity-40" />
            </motion.div>
          </div>
        </div>

        {/* 우: 플레이스 결과 카드 */}
        <div className="p-4 flex flex-col gap-2.5">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
            className="border border-accent bg-accent-bg px-3.5 py-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
              <span className="text-[13px] font-bold text-text-primary">오늘의 브런치, 성수</span>
            </div>
            <p className="text-[11px] text-text-body leading-snug mb-1.5">브런치 카페 · 성수동 · 리뷰 214</p>
            <div className="flex items-center gap-1 text-[10px] text-text-weak" style={EN}>
              <span className="text-[#ffa000]">★★★★★</span> 4.8 · 영업 중
            </div>
          </motion.div>

          {['△△ 브런치하우스', '○○ 카페'].map((n, i) => (
            <div key={n} className="border border-border-light px-3.5 py-3 opacity-55">
              <span className="text-[12px] font-medium text-text-muted">{n}</span>
              <span className="block h-1.5 w-2/3 bg-[#ededed] mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* 하단 */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-t border-border-light bg-bg-alt">
        <span className="rounded-dot w-1.5 h-1.5 bg-[#22c55e]" />
        <span className="text-[12px] text-text-muted">발행하면 <span className="text-accent font-semibold">네이버 플레이스·구글 지도</span>에 함께 올라 지도 검색에도 보입니다</span>
      </div>
    </div>
  );
}
