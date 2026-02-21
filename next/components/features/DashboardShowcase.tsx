'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';

const EN: React.CSSProperties = { fontFamily: 'var(--font-en)' };

const EASE = [0.16, 1, 0.3, 1] as const;
const springPop: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/* ================================================================
   SECTION 01 — Data Integration: Left-Align [Text 40% : Visual 60%]
   ================================================================ */
const SOURCES = [
  { label: 'Cafe24', color: '#00b7ff' },
  { label: 'Meta', color: '#1877f2' },
  { label: 'Google', color: '#34a853' },
  { label: 'GA4', color: '#e37400' },
  { label: 'Market', color: '#8b5cf6' },
];

function DataPipelineVisual({ isActive }: { isActive: boolean }) {
  /*
   * STRICT RULES:
   * 1. stroke-width="1px" + vector-effect="non-scaling-stroke" on EVERY path/rect
   * 2. Pure orthogonal: ONLY M, H, V commands — zero Q/C curves
   * 3. All coordinates hardcoded in one viewBox — line endpoints match box edges exactly
   * 4. Motion paths in <defs> — zero duplicate visible paths
   */
  const LINE = '#e5e5e5';  // Vercel-style: light gray lines
  const BORDER = '#eaeaea'; // box borders slightly darker

  /* Hardcoded coordinate system (viewBox 0 0 800 200) */
  const SRC_X = 10;       // source box left edge
  const SRC_W = 100;      // source box width
  const SRC_R = 110;      // source box right edge (SRC_X + SRC_W)
  const TURN_X = 168;     // vertical bus column
  const NGN_L = 262;      // NGN box left edge
  const NGN_R = 312;      // NGN box right edge
  const NGN_CX = 287;     // NGN center X
  const NGN_CY = 100;     // NGN center Y
  const DASH_L = 380;     // dashboard left edge
  const srcYs = [20, 55, 100, 145, 180]; // source center Y — evenly spaced, #3 = NGN_CY

  /* Pure orthogonal elbow: H → V → H (no curves) */
  const elbowIn = (sy: number) => {
    if (sy === NGN_CY) return `M${SRC_R},${sy}H${NGN_L}`;
    return `M${SRC_R},${sy}H${TURN_X}V${NGN_CY}H${NGN_L}`;
  };
  const elbowOut = `M${NGN_R},${NGN_CY}H${DASH_L}`;

  return (
    <div style={{ width: '100%', background: '#fff', border: '1px solid #eaeaea', padding: '24px 20px' }}>
      <svg viewBox="0 0 800 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* === defs: motion paths only (never rendered) === */}
        <defs>
          {srcYs.map((sy, i) => <path key={i} id={`ep${i}`} d={elbowIn(sy)} />)}
          <path id="ep-out" d={elbowOut} />
        </defs>

        {/* === Layer 1: Orthogonal lines (painted first = below everything) === */}
        {srcYs.map((sy, i) => (
          <path key={i} d={elbowIn(sy)} fill="none" stroke={LINE} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={elbowOut} fill="none" stroke={LINE} strokeWidth="1px" vectorEffect="non-scaling-stroke" />

        {/* === Layer 2: Source boxes === */}
        {SOURCES.map((src, i) => (
          <motion.g
            key={src.label}
            initial={{ opacity: 0, x: -10 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
          >
            <rect x={SRC_X} y={srcYs[i] - 13} width={SRC_W} height="26" fill="#fff" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
            <circle cx={SRC_X + 18} cy={srcYs[i]} r="4" fill={src.color} opacity="0.15" />
            <circle cx={SRC_X + 18} cy={srcYs[i]} r="2" fill={src.color} />
            <text x={SRC_X + 30} y={srcYs[i] + 4} fontSize="10" fontWeight="600" fill="#666" fontFamily="var(--font-en)">{src.label}</text>
          </motion.g>
        ))}

        {/* === Layer 3: NGN box — white rect + 3x3 dots === */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
        >
          <rect x={NGN_L} y={NGN_CY - 25} width={NGN_R - NGN_L} height="50" fill="#fff" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          {[-7, 0, 7].map((dy) =>
            [-7, 0, 7].map((ddx) => (
              <circle key={`${ddx}_${dy}`} cx={NGN_CX + ddx} cy={NGN_CY + dy} r="1.5" fill="#999" opacity="0.4" />
            ))
          )}
          <text x={NGN_CX} y={NGN_CY + 40} textAnchor="middle" fontSize="9" fontWeight="600" fill="#999" fontFamily="var(--font-en)">NGN</text>
        </motion.g>

        {/* === Layer 4: Dashboard panel === */}
        <motion.g
          initial={{ opacity: 0, x: 10 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
        >
          <rect x={DASH_L} y="10" width="280" height="180" fill="#fff" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <rect x={DASH_L} y="10" width="280" height="24" fill="#fafafa" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 14} y="26" fontSize="9" fontWeight="600" fill="#333" fontFamily="var(--font-en)">NGN Dashboard</text>
          <circle cx={DASH_L + 264} cy="22" r="3" fill="#22c55e" />

          {/* Top-left: bar chart */}
          <rect x={DASH_L + 8} y="42" width="128" height="68" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 14} y="54" fontSize="7" fontWeight="500" fill="#999" fontFamily="var(--font-en)">Revenue</text>
          {[12, 20, 28, 38, 34].map((h, i) => (
            <rect key={i} x={DASH_L + 20 + i * 18} y={102 - h} width="13" height={h} fill="#0070f3" opacity={0.3 + i * 0.15} />
          ))}
          <text x={DASH_L + 112} y="100" fontSize="7" fontWeight="700" fill="#22c55e" fontFamily="var(--font-en)">+23%</text>

          {/* Top-right: line chart */}
          <rect x={DASH_L + 144} y="42" width="128" height="68" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 150} y="54" fontSize="7" fontWeight="500" fill="#999" fontFamily="var(--font-en)">Traffic</text>
          <polyline points={`${DASH_L + 154},100 ${DASH_L + 170},94 ${DASH_L + 186},97 ${DASH_L + 202},86 ${DASH_L + 218},78 ${DASH_L + 234},70 ${DASH_L + 250},62`} fill="none" stroke="#22c55e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx={DASH_L + 250} cy="62" r="2.5" fill="#22c55e" />

          {/* Bottom-left: KPIs */}
          <rect x={DASH_L + 8} y="118" width="128" height="64" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 14} y="131" fontSize="7" fontWeight="500" fill="#999" fontFamily="var(--font-en)">Sales</text>
          <text x={DASH_L + 14} y="148" fontSize="13" fontWeight="700" fill="#171717" fontFamily="var(--font-en)">₩12.8M</text>
          <text x={DASH_L + 14} y="161" fontSize="7" fill="#22c55e" fontFamily="var(--font-en)">▲ 23.4% vs prev</text>
          <text x={DASH_L + 14} y="173" fontSize="6.5" fill="#999" fontFamily="var(--font-en)">Orders: 127 | CVR: 2.8%</text>

          {/* Bottom-right: ROAS */}
          <rect x={DASH_L + 144} y="118" width="128" height="64" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 150} y="131" fontSize="7" fontWeight="500" fill="#999" fontFamily="var(--font-en)">ROAS</text>
          <text x={DASH_L + 150} y="152" fontSize="17" fontWeight="700" fill="#0070f3" fontFamily="var(--font-en)">785%</text>
          <text x={DASH_L + 150} y="166" fontSize="6.5" fill="#999" fontFamily="var(--font-en)">Meta 1,024% · Google 412%</text>
        </motion.g>

        {/* === Layer 5: Animated dots — ON TOP of lines === */}
        {isActive && srcYs.map((_, i) => (
          <circle key={`dot${i}`} r="3" fill={SOURCES[i].color}>
            <animateMotion dur={`${2 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.25}s`}>
              <mpath href={`#ep${i}`} />
            </animateMotion>
          </circle>
        ))}
        {isActive && (
          <circle r="3" fill="#0070f3">
            <animateMotion dur="1.6s" repeatCount="indefinite" begin="0.4s">
              <mpath href="#ep-out" />
            </animateMotion>
          </circle>
        )}
      </svg>
    </div>
  );
}

function Section01() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setIsActive(true), 400);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <Section>
      <div ref={ref} style={{ padding: '48px 40px', maxWidth: 1200, margin: '0 auto' }} className="max-md:!p-[40px_24px]">
        {/* TOP: Headline */}
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={staggerContainer}
          style={{ maxWidth: 640, marginBottom: 32 }}
        >
          <motion.div variants={springPop} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', background: '#171717', ...EN }}>01</span>
            <div style={{ width: 40, height: 1, background: '#eaeaea' }} />
          </motion.div>
          <motion.h3 variants={springPop} style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 12 }}>
            5개 플랫폼 데이터<span className="comma">,</span> 1개 화면
          </motion.h3>
          <motion.p variants={springPop} style={{ fontSize: 15, color: '#666', lineHeight: 1.7 }}>
            카페24 · 메타 · 구글 · GA4 · 마켓플레이스. 흩어진 데이터를 안전하게 수집하고 하나의 대시보드로 통합합니다.
          </motion.p>
        </motion.div>

        {/* BOTTOM: Full-Width Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
        >
          <DataPipelineVisual isActive={isActive} />
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   SECTION 02 — AI Report: Accordion with Auto-Expand
   30% text left / 70% visual right
   ================================================================ */
const REPORT_SECTIONS = [
  {
    num: 1, en: 'Performance Summary', kr: '종합 요약',
    detail: 'summary', // render SVG chart
  },
  { num: 2, en: 'Cafe24 Sales', kr: '카페24 매출', detail: 'text', text: '총 매출 ₩12,840,000 (전월 대비 +23.4%). 신규 주문 127건, 재구매율 34%. 객단가 ₩101,102.' },
  { num: 3, en: 'GA4 Traffic Source', kr: 'GA4 유입 분석', detail: 'text', text: 'Direct 32.1%, Instagram 30.0%, Naver 20.0%, Google 17.2%. 전월 대비 총 방문 +11%.' },
  { num: 4, en: 'Monthly Trend', kr: '월간 추이', detail: 'text', text: '3개월 연속 매출 상승세. 1월 ₩9.8M → 2월 ₩10.4M → 3월 ₩12.8M. CVR도 2.1% → 2.8%로 개선.' },
  {
    num: 5, en: 'Product Sales Ranking', kr: '상품별 매출 순위',
    detail: 'ranking',
  },
  { num: 6, en: 'View Items Analysis', kr: '상품 조회 분석', detail: 'text', text: '상위 조회 상품: A(1,204회), B(982회), C(756회). 조회 대비 구매 전환율: A 2.0%, B 1.8%, C 2.0%.' },
  { num: 7, en: 'Platform Ratio', kr: '플랫폼 비중', detail: 'text', text: 'Cafe24 직접판매 68%, 마켓플레이스 32%. 자사몰 비중 전월 대비 +5%p 증가.' },
  { num: 8, en: 'Meta & Google Ads', kr: '광고 성과 분석', detail: 'text', text: '총 광고비 ₩1,052,400. Meta ROAS 1,024%, Google ROAS 412%. CPA ₩8,287 (전월 대비 -15%).' },
  {
    num: 9, en: 'Action Plan', kr: 'AI 개선 제안',
    detail: 'analysis',
  },
];

const AUTO_EXPAND = new Set([1, 9]);

function AccordionItem({ item, isOpen, onToggle, delay }: {
  item: typeof REPORT_SECTIONS[0];
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      style={{ borderBottom: '1px solid #f0f0f0' }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color: isOpen ? '#fff' : '#0070f3',
          background: isOpen ? '#0070f3' : 'rgba(0,112,243,0.08)', flexShrink: 0, ...EN,
          transition: 'all 0.2s ease',
        }}>
          {item.num}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#171717', flex: 1, ...EN }}>{item.en}</span>
        <span style={{ fontSize: 10, color: '#666', marginRight: 4 }}>{item.kr}</span>
        <svg
          style={{ width: 12, height: 12, color: '#999', flexShrink: 0, transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 0 12px 28px' }}>
              {item.detail === 'summary' && <SummaryContent />}
              {item.detail === 'ranking' && <RankingContent />}
              {item.detail === 'analysis' && <AnalysisContent />}
              {item.detail === 'text' && (
                <p style={{ fontSize: 11, color: '#333', lineHeight: 1.7 }}>{item.text}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Detailed content for section 1: KPI numbers only */
function SummaryContent() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
      {[
        { label: '총 매출', value: '₩12.8M', delta: '+23%', color: '#22c55e' },
        { label: '총 광고비', value: '₩1.05M', delta: '-5%', color: '#22c55e' },
        { label: 'ROAS', value: '785%', delta: '+18%', color: '#22c55e' },
      ].map((k) => (
        <div key={k.label} style={{ padding: 8, background: '#fafafa', border: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: 8, color: '#666', marginBottom: 2 }}>{k.label}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#171717', ...EN }}>{k.value}</p>
          <p style={{ fontSize: 8, color: k.color, ...EN }}>{k.delta}</p>
        </div>
      ))}
    </div>
  );
}

/* Detailed content for section 5: product ranking */
function RankingContent() {
  const products = [
    { rank: 1, name: '비타민C 세럼', qty: 24, amount: '₩1,800,000', pct: 100 },
    { rank: 2, name: '히알루론 크림', qty: 18, amount: '₩1,440,000', pct: 80 },
    { rank: 3, name: '선크림 SPF50', qty: 15, amount: '₩1,125,000', pct: 63 },
    { rank: 4, name: '클렌징 오일', qty: 12, amount: '₩840,000', pct: 47 },
    { rank: 5, name: '토너 패드', qty: 9, amount: '₩540,000', pct: 30 },
  ];

  return (
    <div>
      {products.map((p) => (
        <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #f8f8f8' }}>
          <span style={{ width: 16, fontSize: 9, fontWeight: 700, color: p.rank <= 3 ? '#0070f3' : '#999', ...EN }}>{p.rank}</span>
          <span style={{ fontSize: 10, color: '#171717', flex: 1, fontWeight: 500 }}>{p.name}</span>
          <span style={{ fontSize: 9, color: '#666', ...EN }}>{p.qty}건</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#171717', ...EN }}>{p.amount}</span>
        </div>
      ))}
    </div>
  );
}

/* Detailed content for section 9: AI analysis */
function AnalysisContent() {
  const items = [
    { icon: '▲', color: '#22c55e', text: 'Meta 캠페인 예산을 20% 증액하세요. CPA가 15% 감소했고 ROAS 1,024%로 효율이 높습니다.' },
    { icon: '●', color: '#0070f3', text: 'Instagram 유입이 30%로 상승. 리틀 인플루언서 협업이 효과적입니다. 지속 확대를 권장합니다.' },
    { icon: '▼', color: '#ef4444', text: 'Google Ads CPC가 전월 대비 12% 상승. 키워드 재검토와 입찰 전략 변경이 필요합니다.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, padding: 8, background: '#fafafa', border: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 10, color: item.color, flexShrink: 0, lineHeight: 1.6 }}>{item.icon}</span>
          <p style={{ fontSize: 10, color: '#333', lineHeight: 1.6, margin: 0 }}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function AIReportVisual({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'processing' | 'report'>('idle');
  const [progress, setProgress] = useState(0);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const started = useRef(false);

  useEffect(() => {
    if (!isActive || started.current) return;
    started.current = true;
    setPhase('processing');

    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 2000, 1);
      setProgress(p * 100);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const t1 = setTimeout(() => {
      setPhase('report');
      // Auto-expand sections 1, 5, 9 after report appears
      setTimeout(() => setOpenSections(new Set(AUTO_EXPAND)), 300);
    }, 2200);

    return () => { clearTimeout(t1); };
  }, [isActive]);

  const toggleSection = (num: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  return (
    <div style={{ width: '100%', position: 'relative', minHeight: 420 }}>
      {/* Processing overlay */}
      <motion.div
        animate={phase === 'processing' ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(250,250,250,0.95))',
          border: '1px solid #eaeaea', backdropFilter: 'blur(12px)',
          pointerEvents: phase === 'processing' ? 'auto' : 'none',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }}>
          <circle cx="22" cy="22" r="19" fill="none" stroke="#eaeaea" strokeWidth="2" />
          <circle cx="22" cy="22" r="19" fill="none" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" strokeDasharray="90" strokeDashoffset="67" />
        </svg>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', marginBottom: 4 }}>AI Report 생성 중</p>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 16, ...EN }}>Analyzing 5 Platforms...</p>
        <div style={{ width: '50%', height: 3, background: '#eaeaea', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#0070f3', transition: 'width 0.1s linear' }} />
        </div>
        <p style={{ fontSize: 10, color: '#666', marginTop: 6, ...EN }}>{Math.round(progress)}%</p>
      </motion.div>

      {/* Report document — paper card */}
      <motion.div
        animate={phase === 'report' ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{
          background: '#fff', border: '1px solid #eaeaea',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column',
          pointerEvents: phase === 'report' ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #eaeaea', background: '#fafafa', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg style={{ width: 16, height: 16, color: '#171717' }} viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 1h10v14H3V1zm2 2v2h6V3H5zm0 4v1h6V7H5zm0 3v1h4v-1H5z" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#171717', ...EN }}>2026.02 Monthly Analysis</span>
            </div>
            <span style={{ fontSize: 10, color: '#999', ...EN }}>Gemini Pro</span>
          </div>
        </div>

        {/* Accordion body */}
        <div style={{ padding: '4px 16px 16px' }}>
          {REPORT_SECTIONS.map((item, i) => (
            <AccordionItem
              key={item.num}
              item={item}
              isOpen={openSections.has(item.num)}
              onToggle={() => toggleSection(item.num)}
              delay={phase === 'report' ? i * 0.04 : 0}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Section02() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setIsActive(true), 450);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <Section alt>
      <div ref={ref} style={{ padding: '64px 48px', maxWidth: 1080, margin: '0 auto' }} className="max-md:!p-[40px_24px]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '3fr 7fr', gap: 48, alignItems: 'start' }}
          className="max-md:!grid-cols-1 max-md:!gap-8"
        >
          {/* LEFT: Text (30%) */}
          <motion.div variants={staggerContainer} style={{ position: 'sticky', top: 120 }} className="max-md:!static">
            <motion.div variants={springPop} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', background: '#171717', flexShrink: 0, ...EN }}>02</span>
              <div style={{ flex: 1, height: 1, background: '#eaeaea' }} />
            </motion.div>
            <motion.h3 variants={springPop} style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 16 }}>
              AI가 사업을<br />분석합니다
            </motion.h3>
            <motion.p variants={springPop} style={{ fontSize: 15, color: '#333', lineHeight: 1.7 }}>
              매달 1일, Gemini AI가 5개 플랫폼 데이터를 분석하고 9개 섹션의 종합 리포트를 자동 생성합니다.
            </motion.p>
            <motion.p variants={springPop} style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
              Gemini Pro · 자동 생성 · 매월 1일 발행
            </motion.p>
          </motion.div>

          {/* RIGHT: Report Visual (70%) */}
          <motion.div variants={springPop}>
            <AIReportVisual isActive={isActive} />
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   SECTION 03 — Mobile: Modern iPhone + Auto-Scroll Yoyo
   Reduced height, yoyo animation, thin modern bezel
   ================================================================ */
function Section03() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section>
      <div ref={ref} style={{ padding: '80px 48px 48px', maxWidth: 1080, margin: '0 auto' }} className="max-md:!p-[40px_24px_24px]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 48, alignItems: 'center' }}
          className="max-md:!grid-cols-1 max-md:!gap-8"
        >
          {/* LEFT: Text */}
          <motion.div variants={staggerContainer}>
            <motion.div variants={springPop} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', background: '#171717', flexShrink: 0, ...EN }}>03</span>
              <div style={{ flex: 1, height: 1, background: '#eaeaea' }} />
            </motion.div>
            <motion.h3 variants={springPop} style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#171717', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 16 }}>
              언제 어디서든 확인
            </motion.h3>
            <motion.p variants={springPop} style={{ fontSize: 15, color: '#333', lineHeight: 1.7 }}>
              모바일에서도 동일한 대시보드. 터치 최적화 카드형 UI로 매출, 광고 성과, 유입 소스를 바로 확인합니다.
            </motion.p>
            <motion.p variants={springPop} style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
              모바일 최적화 · 터치 UI · 실시간 알림
            </motion.p>
          </motion.div>

          {/* RIGHT: Modern iPhone Mockup with Auto-Scroll */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}
          >
            <div
              style={{
                width: 280,
                background: '#fff',
                border: '1px solid #e5e5e5',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Status bar (minimal) */}
              <div
                style={{
                  height: 28, background: '#fafafa', borderBottom: '1px solid #eaeaea',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{ width: 48, height: 4, background: '#e5e5e5' }} className="rounded-pill" />
              </div>

              {/* Screen */}
              <div
                style={{ overflow: 'hidden', height: 520, background: '#fff', position: 'relative' }}
              >

                {/* Auto-scrolling yoyo content — scroll % matches actual content height */}
                <div className="animate-phone-scroll">
                  <div style={{ padding: '0 12px' }}>
                    {/* App header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#171717', ...EN }}>Dashboard</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['이번 달', 'demo'].map((t) => (
                          <span key={t} style={{ fontSize: 8, padding: '3px 8px', border: '1px solid #eaeaea', color: '#666' }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* KPI cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
                      {[
                        { label: '매출', value: '12.8M', delta: '+23%' },
                        { label: '방문자', value: '3,842', delta: '+11%' },
                        { label: '주문수', value: '127', delta: '+8%' },
                        { label: '광고비율', value: '8.2%', delta: '-2%' },
                      ].map((k) => (
                        <div key={k.label} style={{ border: '1px solid #eaeaea', padding: 10 }}>
                          <p style={{ fontSize: 8, color: '#999', marginBottom: 2 }}>{k.label}</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: '#171717', ...EN }}>{k.value}</p>
                          <p style={{ fontSize: 8, color: '#22c55e', ...EN }}>{k.delta}</p>
                        </div>
                      ))}
                    </div>

                    {/* Mini bar chart */}
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#171717', marginBottom: 8 }}>주간 매출</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60, marginBottom: 16, padding: '0 4px' }}>
                      {[35, 42, 38, 55, 48, 62, 58].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? '#0070f3' : 'rgba(0,112,243,0.2)' }} />
                      ))}
                    </div>

                    {/* Product ranking */}
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#171717', marginBottom: 6 }}>상품판매</p>
                    {[
                      { name: '비타민C 세럼', qty: 24, amount: '1.8M' },
                      { name: '히알루론 크림', qty: 18, amount: '1.4M' },
                      { name: '선크림 SPF50', qty: 15, amount: '1.1M' },
                    ].map((p, i) => (
                      <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, padding: '7px 0', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                        <span><span style={{ fontWeight: 600, color: '#171717', marginRight: 6, ...EN }}>{i + 1}</span>{p.name}</span>
                        <span style={{ ...EN }}>{p.qty}건 · ₩{p.amount}</span>
                      </div>
                    ))}

                    {/* Ad performance */}
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#171717', marginBottom: 6, marginTop: 16 }}>광고 성과</p>
                    <div style={{ border: '1px solid #eaeaea', padding: 10, marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 6 }}>
                        <span style={{ color: '#999' }}>총 광고비</span>
                        <span style={{ fontWeight: 700, color: '#171717', ...EN }}>₩1,052,400</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                        <span style={{ color: '#999' }}>종합 ROAS</span>
                        <span style={{ fontWeight: 700, color: '#22c55e', ...EN }}>785%</span>
                      </div>
                    </div>
                    {/* Ad preview cards with gradient placeholders */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                      {[
                        { tag: 'META', color: '#1877f2', grad: 'linear-gradient(135deg, #e8d5f5 0%, #c4d7f5 50%, #d5e8f5 100%)', campaign: 'Spring Sale', roas: '1,024%' },
                        { tag: 'GOOGLE', color: '#34a853', grad: 'linear-gradient(135deg, #d5f5e3 0%, #c4e8f5 50%, #d5dff5 100%)', campaign: 'Brand KW', roas: '412%' },
                      ].map((r) => (
                        <div key={r.tag} style={{ border: '1px solid #eaeaea', overflow: 'hidden' }}>
                          {/* Gradient image placeholder */}
                          <div style={{ height: 64, background: r.grad, position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 4 }}>
                            <span style={{ fontSize: 6, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.35)', padding: '1px 4px', ...EN }}>Sponsored</span>
                          </div>
                          <div style={{ padding: '6px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                              <span style={{ fontSize: 6, fontWeight: 700, color: '#fff', background: r.color, padding: '1px 3px', ...EN }}>{r.tag}</span>
                              <span style={{ fontSize: 8, fontWeight: 600, color: '#171717' }}>{r.campaign}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8 }}>
                              <span style={{ color: '#999' }}>ROAS</span>
                              <span style={{ fontWeight: 700, color: '#22c55e', ...EN }}>{r.roas}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* GA4 source */}
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#171717', marginBottom: 6, marginTop: 16 }}>GA4 유입 소스</p>
                    {['(direct) · 354', 'instagram · 331', 'naver.com · 220', 'google · 189'].map((row) => (
                      <div key={row} style={{ fontSize: 9, color: '#666', padding: '6px 0', borderBottom: '1px solid #f0f0f0', ...EN }}>{row}</div>
                    ))}

                    {/* AI insight */}
                    <div style={{ marginTop: 16, padding: 10, background: 'rgba(0,112,243,0.04)', border: '1px solid rgba(0,112,243,0.1)' }}>
                      <p style={{ fontSize: 8, fontWeight: 700, color: '#0070f3', marginBottom: 4, ...EN }}>AI Insight</p>
                      <p style={{ fontSize: 9, color: '#333', lineHeight: 1.5 }}>Meta 캠페인 예산 증액을 권장합니다. CPA가 15% 감소하여 효율이 높습니다.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderTop: '1px solid #eaeaea' }}>
                <div className="rounded-pill" style={{ width: 80, height: 4, background: '#e5e5e5' }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export default function DashboardShowcase() {
  return (
    <>
      <Section id="dashboard" crossMarks>
        <div className="py-20 px-12 max-md:py-12 max-md:px-6">
          <FadeUp>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0070f3', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, ...EN }}>Dashboard</p>
              <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.15] mb-4">
                매출·광고·방문자 데이터를<br />한 화면에서
              </h2>
              <p style={{ fontSize: 17, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
                카페24 매출, 메타·구글 광고, GA4 방문자 — 하나의 대시보드에서 실시간 확인.
              </p>
              <Link href="/start" className="inline-flex items-center gap-2 text-[14px] text-accent font-medium hover:gap-3 transition-[gap] duration-150">
                Dashboard 시작하기
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4" /></svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section01 />
      <Section02 />
      <Section03 />
    </>
  );
}
