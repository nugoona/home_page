'use client';

import { motion } from 'framer-motion';

const EN = { fontFamily: 'var(--font-en)' } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const kpis = [
  { label: '매출', value: '₩12.8M', delta: '+23%', up: true },
  { label: 'ROAS', value: '785%', delta: '+18%', up: true },
  { label: '광고비', value: '₩1.05M', delta: '-2%', up: false },
  { label: '전환', value: '127', delta: '+8%', up: true },
];
const bars = [35, 42, 38, 55, 48, 62, 58];

/** /ads 히어로 목업 — 다크 히어로 위에 뜬 라이트 대시보드 프리뷰(실화면 재현) */
export default function HeroDashboardMock() {
  return (
    <div className="border border-border-default bg-white shadow-[0_28px_80px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.3)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-light bg-bg-alt">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-text-primary" style={EN}>NGN Dashboard</span>
          <span className="rounded-dot w-2 h-2 bg-[#22c55e]" />
        </div>
        <div className="flex gap-1.5">
          {['이번 달', 'Meta·Google'].map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 border border-border-default text-text-muted">{t}</span>
          ))}
        </div>
      </div>

      <div className="p-5 max-md:p-4">
        {/* KPI 4 */}
        <div className="grid grid-cols-4 gap-2 mb-5 max-sm:grid-cols-2">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.35 + i * 0.08 }}
              className="border border-border-default p-3"
            >
              <p className="text-[10px] text-text-muted mb-1">{k.label}</p>
              <p className="text-[16px] font-bold text-text-primary leading-none mb-1" style={EN}>{k.value}</p>
              <p className={`text-[10px] font-semibold ${k.up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`} style={EN}>
                {k.up ? '▲' : '▼'} {k.delta}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 주간 매출 미니 차트 */}
        <div className="border border-border-default p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-text-primary">주간 매출</p>
            <span className="text-[10px] text-[#22c55e] font-semibold" style={EN}>종합 ROAS 785%</span>
          </div>
          <div className="flex items-end gap-1.5 h-[64px]">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.6 + i * 0.06 }}
                className={`flex-1 ${i === 5 ? 'bg-accent' : 'bg-accent/25'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
