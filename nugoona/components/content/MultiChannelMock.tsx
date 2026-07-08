'use client';

import { motion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const channels = [
  { name: '네이버 블로그', color: '#03c75a' },
  { name: '네이버 플레이스', color: '#03c75a' },
  { name: '인스타그램', color: '#e1306c' },
  { name: '구글', color: '#4285f4' },
];

/** S4 전 채널 발행 목업 — 사진·메모 입력 → AI가 글 작성 → 채널별 발행 (제품 화면 재현) */
export default function MultiChannelMock() {
  return (
    <div className="border border-border-default bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.03)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
        <span className="text-[11px] font-semibold text-text-muted tracking-[0.08em]" style={EN}>
          NUGOONA CONTENT
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-text-weak" style={EN}>
          <span className="rounded-dot w-1.5 h-1.5 bg-[#22c55e]" />
          Auto-publish
        </span>
      </div>

      <div className="p-6 max-md:p-5">
        {/* 입력: 사진 + 메모 */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-bg-alt border border-border-light mb-4">
          <div className="flex gap-1.5 shrink-0">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-8 h-8 bg-[#e8e8e8] border border-border-light" />
            ))}
          </div>
          <span className="text-[13px] text-text-muted leading-snug">
            사진 3장 · “오늘 신메뉴 나왔어요”
          </span>
        </div>

        {/* AI 처리중 (은은한 펄스) */}
        <motion.div
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-2.5 px-4 py-3 border mb-4"
          style={{ background: 'rgba(0,112,243,0.04)', borderColor: 'rgba(0,112,243,0.15)' }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#0070f3" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 2v2M8 12v2M2 8h2M12 8h2" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] font-semibold text-accent">스토어 말투 그대로, 검색에 잡히는 글로 작성 중…</span>
        </motion.div>

        {/* 출력: 채널별 발행 */}
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {channels.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.4 + i * 0.12 }}
              className="flex items-center gap-2.5 px-4 py-3 border border-border-default bg-white"
            >
              <span className="rounded-dot w-2.5 h-2.5 shrink-0" style={{ background: c.color }} />
              <span className="text-[13px] font-medium text-text-primary flex-1" style={EN}>{c.name}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="1.75">
                <path d="M3 7l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
