'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import GridDivider from '@/components/ui/GridDivider';


const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

/* ════════════════════════════════════════════════════════════
   Dashboard Mockup — 컴팩트, 랜덤 데이터
   ════════════════════════════════════════════════════════════ */
const connected = [
  { name: 'Cafe24', color: '#00a651' },
  { name: 'Meta', color: '#0081FB' },
  { name: 'Google', color: '#4285F4' },
  { name: 'GA4', color: '#F9AB00' },
];

const datasets = [
  {
    company: '르비앙',
    period: '오늘',
    kpis: [
      { label: '사이트 매출', value: '1,418,000', accent: true },
      { label: '주문수', value: '31', accent: false },
      { label: '방문자', value: '1,887', accent: false },
      { label: '광고비율(%)', value: '47.10%', accent: false },
    ],
    adRows: [
      { name: '전체', badge: null, cost: '667,823', roas: '368.64%', cpc: '417', amount: '2,461,894', isTotal: true },
      { name: '블루밍샵', badge: 'Meta', cost: '91,000', roas: '794.51%', cpc: '173', amount: '723,000', isTotal: false },
      { name: '데일리룩', badge: 'Google', cost: '528,998', roas: '328.71%', cpc: '612', amount: '1,738,894', isTotal: false },
    ],
    bars: [
      { name: '에이블리', pct: 31.5, amount: '₩1,517,000' },
      { name: '자사몰', pct: 29.4, amount: '₩1,418,000' },
      { name: 'EQL', pct: 14.3, amount: '₩688,000' },
    ],
  },
  {
    company: '포레스트블룸',
    period: '이번주',
    kpis: [
      { label: '사이트 매출', value: '8,542,000', accent: true },
      { label: '주문수', value: '187', accent: false },
      { label: '방문자', value: '12,450', accent: false },
      { label: '광고비율(%)', value: '32.80%', accent: false },
    ],
    adRows: [
      { name: '전체', badge: null, cost: '2,801,000', roas: '412.30%', cpc: '385', amount: '11,548,000', isTotal: true },
      { name: '봄컬렉션', badge: 'Meta', cost: '1,240,000', roas: '520.16%', cpc: '298', amount: '6,450,000', isTotal: false },
      { name: '신상아우터', badge: 'Google', cost: '1,561,000', roas: '326.72%', cpc: '487', amount: '5,098,000', isTotal: false },
    ],
    bars: [
      { name: '자사몰', pct: 42.1, amount: '₩8,542,000' },
      { name: '에이블리', pct: 28.7, amount: '₩5,820,000' },
      { name: '29CM', pct: 15.2, amount: '₩3,082,000' },
    ],
  },
  {
    company: '어반시크',
    period: '이번달',
    kpis: [
      { label: '사이트 매출', value: '34,210,000', accent: true },
      { label: '주문수', value: '724', accent: false },
      { label: '방문자', value: '48,320', accent: false },
      { label: '광고비율(%)', value: '28.50%', accent: false },
    ],
    adRows: [
      { name: '전체', badge: null, cost: '9,750,000', roas: '487.28%', cpc: '342', amount: '47,510,000', isTotal: true },
      { name: '시즌오프', badge: 'Meta', cost: '5,400,000', roas: '552.41%', cpc: '310', amount: '29,830,000', isTotal: false },
      { name: '베스트셀러', badge: 'Google', cost: '4,350,000', roas: '406.44%', cpc: '389', amount: '17,680,000', isTotal: false },
    ],
    bars: [
      { name: '자사몰', pct: 38.5, amount: '₩34,210,000' },
      { name: '무신사', pct: 31.2, amount: '₩27,720,000' },
      { name: '에이블리', pct: 18.3, amount: '₩16,270,000' },
    ],
  },
];

function DashboardMockup() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % datasets.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const d = datasets[activeIdx];

  return (
    <div className="bg-[#0f172a] overflow-hidden" style={{ WebkitFontSmoothing: 'auto', MozOsxFontSmoothing: 'auto' }}>
      {/* Header Nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white flex items-center justify-center">
            <span className="text-[7px] font-semibold text-[#0f172a]" style={EN}>N</span>
          </div>
          <span className="text-[11px] font-medium text-[rgba(255,255,255,0.85)]" style={EN}>{d.company} ▾</span>
          <span className="text-[11px] font-medium text-[rgba(255,255,255,0.85)]" style={EN}>{d.period} ▾</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[5px] h-[5px] bg-[#22c55e] rounded-dot" />
          <span className="text-[9px] text-[rgba(255,255,255,0.4)]" style={EN}>Live</span>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-b border-[rgba(255,255,255,0.08)]">
        <span className="text-[9px] text-[rgba(255,255,255,0.4)]">Connected</span>
        {connected.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-[5px] h-[5px] rounded-dot"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-[9px] text-[rgba(255,255,255,0.7)] font-medium" style={EN}>{p.name}</span>
          </div>
        ))}
      </div>

      <div>
          {/* KPI Section */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-[3px] h-[13px] bg-accent" />
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.9)]">사이트 성과요약</span>
            </div>
            <div className="flex gap-2">
              {d.kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="flex-1 px-3 py-2.5 bg-[#1e293b] border border-[rgba(255,255,255,0.08)]"
                >
                  <p className="text-[9px] font-medium text-[rgba(255,255,255,0.5)] mb-1 whitespace-nowrap">{kpi.label}</p>
                  <p
                    className={`text-[14px] font-semibold tracking-[-0.02em] whitespace-nowrap ${
                      kpi.accent ? 'text-accent' : 'text-white'
                    }`}
                    style={EN}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Performance Table */}
          <div className="px-5 pb-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-[3px] h-[13px] bg-accent" />
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.9)]">총 광고 성과</span>
            </div>
            <div className="border border-[rgba(255,255,255,0.1)] overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-[#1e293b] border-b-2 border-accent">
                {['광고 매체', '광고비', 'ROAS(%)', '클릭당비용', '구매금액'].map((h) => (
                  <div key={h} className="px-2 py-2">
                    <span className="text-[9px] font-semibold text-[rgba(255,255,255,0.6)] uppercase tracking-[0.05em]" style={EN}>{h}</span>
                  </div>
                ))}
              </div>
              {d.adRows.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-[rgba(255,255,255,0.08)] last:border-b-0 ${
                    row.isTotal ? 'bg-[rgba(255,255,255,0.06)]' : ''
                  }`}
                >
                  <div className="px-2 py-1.5 flex items-center gap-1">
                    <span
                      className={`text-[11px] font-medium ${row.isTotal ? 'text-white font-semibold' : 'text-[rgba(255,255,255,0.85)]'}`}
                    >
                      {row.name}
                    </span>
                    {row.badge && (
                      <span
                        className={`text-[7px] font-medium px-1 py-0.5 ${
                          row.badge === 'Meta'
                            ? 'bg-[rgba(0,129,251,0.15)] text-[#60a5fa]'
                            : 'bg-[rgba(234,67,53,0.15)] text-[#f87171]'
                        }`}
                        style={EN}
                      >
                        {row.badge}
                      </span>
                    )}
                  </div>
                  {[row.cost, row.roas, row.cpc, row.amount].map((val, j) => (
                    <div key={j} className="px-2 py-1.5">
                      <span
                        className={`text-[11px] ${
                          row.isTotal
                            ? 'text-white font-semibold'
                            : j === 1 && val !== '0.00%'
                              ? 'text-[#4ade80] font-semibold'
                              : 'text-[rgba(255,255,255,0.85)]'
                        }`}
                        style={EN}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Platform Revenue Bar Chart */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-[3px] h-[13px] bg-accent" />
              <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.9)]">플랫폼별 매출 비중</span>
            </div>
            <div className="flex flex-col gap-2">
              {d.bars.map((bar, i) => {
                const maxPct = Math.max(...d.bars.map((b) => b.pct));
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-[16px] h-[16px] flex items-center justify-center text-[8px] font-semibold text-white shrink-0"
                      style={{ backgroundColor: `hsl(${265 - i * 8}, 60%, ${55 + i * 5}%)` }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-[10px] font-medium text-[rgba(255,255,255,0.85)] w-[44px] shrink-0">{bar.name}</span>
                    <span className="text-[10px] font-semibold text-white w-[32px] shrink-0" style={EN}>
                      {bar.pct}%
                    </span>
                    <div className="flex-1 h-[5px] bg-[rgba(255,255,255,0.08)]">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${(bar.pct / maxPct) * 100}%`,
                          background: `linear-gradient(90deg, #8b5cf6, hsl(${265 - i * 12}, 50%, ${65 + i * 5}%))`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-white whitespace-nowrap" style={EN}>
                      {bar.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EvidenceInsight — Main Section
   ════════════════════════════════════════════════════════════ */
export default function EvidenceInsight() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <GridDivider />
      {/* Row 1: Dark — Hero (left) + Sub-title (right) */}
      <div className="bg-[#0a0a0a]">
        <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr]">
          <div className="pt-[100px] px-12 max-md:pt-16 max-md:px-6 max-md:pb-12 max-md:flex max-md:items-center max-md:justify-center md:py-[100px] md:flex md:items-center md:justify-center">
            <FadeUp>
              <div>
                <p
                  className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-4"
                  style={EN}
                >
                  Insight
                </p>
                <p className="text-[clamp(24px,3.5vw,32px)] font-semibold text-white leading-[1.4] tracking-[-0.02em]">
                  보고서 기다리지 마세요.
                  <br />
                  매출·광고·ROAS, <span className="font-semibold text-accent">지금 바로 확인</span>하세요.
                </p>
              </div>
            </FadeUp>
          </div>
          <div className="relative md:border-l md:border-[rgba(255,255,255,0.1)] px-12 pt-6 pb-10 max-md:px-6 max-md:border-t max-md:border-[rgba(255,255,255,0.1)] max-md:pt-8 md:py-[100px] md:flex md:items-center">

            <FadeUp delay={0.15} className="w-full">
            <div>
              <p className="text-[19px] font-semibold text-[rgba(255,255,255,0.9)] leading-[1.4] tracking-[-0.01em] mb-1">
                흩어진 데이터를 한 화면에.
              </p>
              <p className="text-[15px] text-[rgba(255,255,255,0.85)] font-light leading-[1.4]">
                Cafe24·Meta·Google·GA4를 하나의 대시보드에서 실시간으로.
              </p>
            </div>
          </FadeUp>
          </div>
        </div>
      </div>

      {/* Row 2: Dashboard with grid frame */}
      <GridDivider />
      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
      >
        {/* Left column: squares + right-side shadow (same as GridDivider) */}
        <div className="relative z-10" style={{ boxShadow: '1px 0 0 var(--color-border-default)' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square"
              style={{ borderBottom: '0.5px solid var(--color-border-default)' }}
            />
          ))}
        </div>

        {/* Dashboard — 10 columns, right-side shadow only */}
        <div
          className="col-span-10"
          style={{ boxShadow: '1px 0 0 var(--color-border-default)' }}
        >
          <FadeUp delay={0.12}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <DashboardMockup />
            </motion.div>
          </FadeUp>
        </div>

        {/* Right column: squares */}
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square"
              style={{ borderBottom: '0.5px solid var(--color-border-default)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
