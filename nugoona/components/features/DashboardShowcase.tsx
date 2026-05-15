'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
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
   SECTION 01 — Data Integration
   ================================================================ */
const SOURCES = [
  { label: 'Cafe24', color: '#00b7ff' },
  { label: 'Meta', color: '#1877f2' },
  { label: 'Google', color: '#34a853' },
  { label: 'GA4', color: '#e37400' },
  { label: 'Market', color: '#8b5cf6' },
];

function DataPipelineVisual({ isActive }: { isActive: boolean }) {
  const LINE = '#555';
  const BORDER = '#eaeaea';   // dashboard only
  const BOX_BORDER = '#555';  // source + NGN boxes
  const SRC_X = 10, SRC_W = 100, SRC_R = 110;
  const NGN_L = 262, NGN_R = 312, NGN_CX = 287, NGN_CY = 100;
  const DASH_L = 380;
  const srcYs      = [20,  55,  100, 145, 180];
  const ngnEntryYs = [82,  90,  100, 110, 118];
  const turnXs     = [148, 162, null, 162, 148] as (number | null)[];

  const elbowIn = (i: number) => {
    const sy = srcYs[i], ey = ngnEntryYs[i], tx = turnXs[i];
    if (tx === null) return `M${SRC_R},${sy}H${NGN_L}`;
    return `M${SRC_R},${sy}H${tx}V${ey}H${NGN_L}`;
  };
  const elbowOut = `M${NGN_R},${NGN_CY}H${DASH_L}`;

  return (
    <svg viewBox="0 0 680 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        {srcYs.map((_, i) => <path key={i} id={`ep${i}`} d={elbowIn(i)} />)}
        <path id="ep-out" d={elbowOut} />
      </defs>

      {srcYs.map((_, i) => (
        <path key={i} d={elbowIn(i)} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={elbowOut} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />

      {SOURCES.map((src, i) => (
        <motion.g
          key={src.label}
          initial={{ opacity: 0, x: -10 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
        >
          <rect x={SRC_X} y={srcYs[i] - 13} width={SRC_W} height="26" fill="#fff" stroke={BOX_BORDER} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <circle cx={SRC_X + 18} cy={srcYs[i]} r="4" fill={src.color} opacity="0.15" />
          <circle cx={SRC_X + 18} cy={srcYs[i]} r="2" fill={src.color} />
          <text x={SRC_X + 30} y={srcYs[i] + 4} fontSize="10" fontWeight="600" fill="#333" fontFamily="var(--font-en)">{src.label}</text>
        </motion.g>
      ))}

      <motion.g
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
      >
        <rect x={NGN_L} y={NGN_CY - 25} width={NGN_R - NGN_L} height="50" fill="#fff" stroke={BOX_BORDER} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        {[-7, 0, 7].map((dy) =>
          [-7, 0, 7].map((ddx) => (
            <circle key={`${ddx}_${dy}`} cx={NGN_CX + ddx} cy={NGN_CY + dy} r="1.5" fill="#555" opacity="0.6" />
          ))
        )}
        <text x={NGN_CX} y={NGN_CY + 40} textAnchor="middle" fontSize="9" fontWeight="600" fill="#555" fontFamily="var(--font-en)">NGN</text>
      </motion.g>

        <motion.g
          initial={{ opacity: 0, x: 10 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
        >
          <rect x={DASH_L} y="10" width="280" height="180" fill="#fff" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <rect x={DASH_L} y="10" width="280" height="24" fill="#fafafa" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 14} y="26" fontSize="9" fontWeight="600" fill="#333" fontFamily="var(--font-en)">NGN Dashboard</text>
          <circle cx={DASH_L + 264} cy="22" r="3" fill="#22c55e" />

          <rect x={DASH_L + 8} y="42" width="128" height="68" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 14} y="54" fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">매출</text>
          {[12, 20, 28, 38, 34].map((h, i) => (
            <rect key={i} x={DASH_L + 20 + i * 18} y={102 - h} width="13" height={h} fill="#0070f3" opacity={0.3 + i * 0.15} />
          ))}
          <text x={DASH_L + 112} y="100" fontSize="7" fontWeight="700" fill="#22c55e" fontFamily="var(--font-en)">+23%</text>

          <rect x={DASH_L + 144} y="42" width="128" height="68" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 150} y="54" fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">방문자</text>
          <polyline points={`${DASH_L + 154},100 ${DASH_L + 170},94 ${DASH_L + 186},97 ${DASH_L + 202},86 ${DASH_L + 218},78 ${DASH_L + 234},70 ${DASH_L + 250},62`} fill="none" stroke="#22c55e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx={DASH_L + 250} cy="62" r="2.5" fill="#22c55e" />

          <rect x={DASH_L + 8} y="118" width="128" height="64" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 14} y="131" fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">매출</text>
          <text x={DASH_L + 14} y="148" fontSize="11" fontWeight="700" fill="#171717" fontFamily="var(--font-en)">₩12,800,000</text>
          <text x={DASH_L + 14} y="161" fontSize="7" fill="#22c55e" fontFamily="var(--font-en)">▲ 23.4% vs prev</text>
          <text x={DASH_L + 14} y="173" fontSize="6.5" fill="#666" fontFamily="var(--font-en)">Orders: 127 | CVR: 2.8%</text>

          <rect x={DASH_L + 144} y="118" width="128" height="64" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
          <text x={DASH_L + 150} y="131" fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">ROAS</text>
          <text x={DASH_L + 150} y="152" fontSize="17" fontWeight="700" fill="#0070f3" fontFamily="var(--font-en)">785%</text>
          <text x={DASH_L + 150} y="166" fontSize="6.5" fill="#666" fontFamily="var(--font-en)">Meta 1,024% · Google 412%</text>
        </motion.g>

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
  );
}

/* ── 모바일 전용: 세로 파이프라인 ── */
function DataPipelineVisualMobile({ isActive }: { isActive: boolean }) {
  const LINE = '#555';
  const BORDER = '#eaeaea';   // dashboard only
  const BOX_BORDER = '#555';  // source + NGN boxes

  const SW = 56, SH = 28, SY = 10, SM = 10, SGAP = 5;
  const srcXs  = SOURCES.map((_, i) => SM + i * (SW + SGAP));
  const srcCXs = srcXs.map(x => x + SW / 2); // [38,99,160,221,282]
  const SRC_BOT = SY + SH; // 38

  const NGN_L = 140, NGN_W = 40, NGN_H = 40;
  const NGN_TOP = 82;
  const NGN_CY  = NGN_TOP + NGN_H / 2; // 102
  const NGN_BOT = NGN_TOP + NGN_H;     // 122
  const MX = NGN_L + NGN_W / 2;        // 160
  const DASH_TOP = 160, DL = 10, DW = 300, DH = 182;

  // 겹침 없는 fan 수렴: 각 라인마다 고유 entry X + turn Y
  const ngnEntryXs = [144, 152, 160, 168, 176];
  const turnYs     = [48,  56,  null, 56,  48] as (number | null)[];
  const outPath    = `M160,${NGN_BOT}V${DASH_TOP}`;

  const elbowDown = (i: number) => {
    const cx = srcCXs[i], ex = ngnEntryXs[i], ty = turnYs[i];
    if (ty === null) return `M${cx},${SRC_BOT}V${NGN_TOP}`;
    return `M${cx},${SRC_BOT}V${ty}H${ex}V${NGN_TOP}`;
  };

  return (
    <svg viewBox="0 0 320 350" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        {srcCXs.map((_, i) => <path key={i} id={`mep${i}`} d={elbowDown(i)} />)}
        <path id="mep-out" d={outPath} />
      </defs>

      {/* 정적 파이프 */}
      {srcCXs.map((_, i) => (
        <path key={i} d={elbowDown(i)} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={outPath} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />

      {/* 소스 박스 */}
      {SOURCES.map((src, i) => (
        <motion.g key={src.label} initial={{ opacity: 0, y: -8 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
          <rect x={srcXs[i]} y={SY} width={SW} height={SH} fill="#fff" stroke={BOX_BORDER} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <circle cx={srcXs[i] + 11} cy={SY + SH / 2} r="3.5" fill={src.color} opacity="0.15" />
          <circle cx={srcXs[i] + 11} cy={SY + SH / 2} r="1.8" fill={src.color} />
          <text x={srcXs[i] + 20} y={SY + SH / 2 + 4} fontSize="9" fontWeight="600" fill="#333" fontFamily="var(--font-en)">{src.label}</text>
        </motion.g>
      ))}

      {/* NGN 박스 */}
      <motion.g initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}>
        <rect x={NGN_L} y={NGN_TOP} width={NGN_W} height={NGN_H} fill="#fff" stroke={BOX_BORDER} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        {[-6, 0, 6].map(dy => [-6, 0, 6].map(dx => (
          <circle key={`${dx}_${dy}`} cx={MX + dx} cy={NGN_CY + dy} r="1.5" fill="#555" opacity="0.6" />
        )))}
        <text x={NGN_L + NGN_W + 6} y={NGN_CY + 4} textAnchor="start" fontSize="9" fontWeight="600" fill="#555" fontFamily="var(--font-en)">NGN</text>
      </motion.g>

      {/* 대시보드 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}>
        <rect x={DL} y={DASH_TOP} width={DW} height={DH} fill="#fff" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <rect x={DL} y={DASH_TOP} width={DW} height="24" fill="#fafafa" stroke={BORDER} strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <text x={DL + 12} y={DASH_TOP + 16} fontSize="9" fontWeight="600" fill="#333" fontFamily="var(--font-en)">NGN Dashboard</text>
        <circle cx={DL + DW - 14} cy={DASH_TOP + 12} r="3" fill="#22c55e" />

        <rect x={DL + 8} y={DASH_TOP + 32} width="136" height="65" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <text x={DL + 14} y={DASH_TOP + 44} fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">매출</text>
        {[12, 20, 28, 38, 34].map((h, i) => (
          <rect key={i} x={DL + 18 + i * 20} y={DASH_TOP + 90 - h} width="16" height={h} fill="#0070f3" opacity={0.3 + i * 0.15} />
        ))}
        <text x={DL + 120} y={DASH_TOP + 89} fontSize="7" fontWeight="700" fill="#22c55e" fontFamily="var(--font-en)">+23%</text>

        <rect x={DL + 152} y={DASH_TOP + 32} width="140" height="65" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <text x={DL + 158} y={DASH_TOP + 44} fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">방문자</text>
        <polyline points={`${DL+162},${DASH_TOP+88} ${DL+178},${DASH_TOP+82} ${DL+194},${DASH_TOP+85} ${DL+210},${DASH_TOP+74} ${DL+226},${DASH_TOP+66} ${DL+242},${DASH_TOP+58} ${DL+258},${DASH_TOP+50}`} fill="none" stroke="#22c55e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <circle cx={DL + 258} cy={DASH_TOP + 50} r="2.5" fill="#22c55e" />

        <rect x={DL + 8} y={DASH_TOP + 105} width="136" height="65" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <text x={DL + 14} y={DASH_TOP + 118} fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">매출</text>
        <text x={DL + 14} y={DASH_TOP + 136} fontSize="10" fontWeight="700" fill="#171717" fontFamily="var(--font-en)">₩12,800,000</text>
        <text x={DL + 14} y={DASH_TOP + 150} fontSize="7" fill="#22c55e" fontFamily="var(--font-en)">▲ 23.4% vs prev</text>

        <rect x={DL + 152} y={DASH_TOP + 105} width="140" height="65" fill="#fafafa" stroke="#f0f0f0" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <text x={DL + 158} y={DASH_TOP + 118} fontSize="7" fontWeight="500" fill="#444" fontFamily="var(--font-en)">ROAS</text>
        <text x={DL + 158} y={DASH_TOP + 148} fontSize="18" fontWeight="700" fill="#0070f3" fontFamily="var(--font-en)">785%</text>
        <text x={DL + 158} y={DASH_TOP + 163} fontSize="6.5" fill="#666" fontFamily="var(--font-en)">Meta 1,024% · Google 412%</text>
      </motion.g>

      {/* 애니메이션 도트 */}
      {isActive && srcCXs.map((_, i) => (
        <circle key={`mdot${i}`} r="3" fill={SOURCES[i].color}>
          <animateMotion dur={`${2 + i * 0.15}s`} repeatCount="indefinite" begin={`${i * 0.25}s`}>
            <mpath href={`#mep${i}`} />
          </animateMotion>
        </circle>
      ))}
      {isActive && (
        <circle r="3" fill="#0070f3">
          <animateMotion dur="1.6s" repeatCount="indefinite" begin="0.4s">
            <mpath href="#mep-out" />
          </animateMotion>
        </circle>
      )}
    </svg>
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
      <div ref={ref}>
        {/* Title row — 2-column with vertical divider */}
        <div className="grid grid-cols-[7fr_5fr] max-md:grid-cols-1 border-b border-border-default">
          {/* LEFT: num + title */}
          <FadeUp className="px-10 py-10 [box-shadow:1px_0_0_var(--color-border-default)] max-md:[box-shadow:none] max-md:px-6 max-md:pb-5">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717]" style={EN}>01</span>
              <div className="w-10 h-px bg-[#eaeaea]" />
            </div>
            <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#171717] tracking-[-0.02em] leading-[1.25]">
              모든 채널<span className="comma">,</span> 화면은 하나
            </h3>
          </FadeUp>

          {/* RIGHT: desc + chips */}
          <FadeUp delay={0.1} className="px-10 py-10 flex flex-col justify-center max-md:px-6 max-md:pt-0 max-md:pb-8">
            <p className="text-[15px] text-[#333] leading-[1.45] tracking-[-0.02em] mb-5">
              흩어진 데이터를 안전하게 수집하고<br />하나의 대시보드로 통합합니다.
            </p>
            {/* Connected platforms label */}
            <p className="text-[10px] font-semibold text-[#999] tracking-[0.08em] uppercase mb-2 max-md:hidden" style={{ fontFamily: 'var(--font-en)' }}>
              Connected Platforms
            </p>
            {/* Platform chips */}
            <div className="flex gap-1.5 md:flex-wrap max-md:hidden">
              {['Cafe24', 'Meta', 'Google', 'GA4', '29CM', 'Ably', '+ more'].map((name) => (
                <span
                  key={name}
                  className="text-[11px] font-medium px-2.5 py-1"
                  style={{ border: '1px solid #e0e0e0', color: '#333', fontFamily: 'var(--font-en)' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Full-width pipeline visual */}
        <FadeUp delay={0.15} className="py-10 max-md:py-6">
          <div className="hidden md:block">
            <DataPipelineVisual isActive={isActive} />
          </div>
          <div className="block md:hidden">
            <DataPipelineVisualMobile isActive={isActive} />
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}

/* ================================================================
   SECTION 02 — AI Monthly Report: Magazine Layout
   ================================================================ */



function AIAnalysis({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ai-card" style={{ borderLeft: '2px solid #0070f3', paddingLeft: 10, marginBottom: 12 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', marginBottom: 4 }}>{title}</p>
      <div style={{ fontSize: 12, fontWeight: 400, color: '#555', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

/* 01 — 지난달 매출 분석 */
function Sales01Card() {
  const kpis = [
    { label: '월 매출 (GMV)',    value: '₩34,055,000', sub: '전월 · 전년 동월 비교', delta: '▼ -6.9%'  },
    { label: '주문 건수',        value: '610건',         sub: '전월 대비 추이',        delta: '▼ -1.6%'  },
    { label: '객단가 (AOV)',     value: '₩55,828',      sub: '전월 대비 분석',        delta: '▼ -5.4%'  },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 14 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <p style={{ fontSize: 10, color: '#888', marginBottom: 3 }}>{k.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#171717', lineHeight: 1, ...EN }}>{k.value}</p>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', ...EN }}>{k.delta}</span>
            </div>
            <p style={{ fontSize: 10, color: '#bbb' }}>{k.sub}</p>
          </div>
        ))}
      </div>
      <AIAnalysis title="매출 성과 진단">
        월 매출을 <strong>주문수·객단가·이벤트 효과</strong>로 분해하고,
        전월·전년 대비 성장 원인을 해석합니다.
      </AIAnalysis>
      <AIAnalysis title="객단가 변화 분석">
        평균 객단가 등락의 <strong>상품 구성 변화·프로모션 영향</strong>을 분리해
        다음 달 AOV 개선 방향을 제시합니다.
      </AIAnalysis>
    </div>
  );
}

/* 03 — 고객 방문 및 구매 여정 */
function Funnel03Card() {
  const rows = [
    { label: '유입수 (GA)',        value: 40733, pct: 100,  color: '#1e3a5f', cvr: null },
    { label: '장바구니 건수 (GA)', value: 8248,  pct: 20.2, color: '#8b5cf6', cvr: '전환율 20.25%' },
    { label: '주문 건수',           value: 610,   pct: 7.4,  color: '#ef4444', cvr: '전환율 7.4%' },
  ];
  return (
    <div>
      {/* Title */}
      <div className="mx-[-2.5rem] mt-[-2.5rem] px-[2.5rem] max-md:mx-[-1.5rem] max-md:mt-[-2rem] max-md:px-[1.5rem]" style={{ background: '#f0f0f0', borderBottom: '1px solid var(--color-border-default)', minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 400, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-en)', marginBottom: 3 }}>Customer Journey</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.25 }}>방문부터 구매까지 전환 흐름을 분석합니다.</p>
      </div>
      <div className="grid grid-cols-2 max-md:grid-cols-1 items-center">
        {/* Left: funnel bars */}
        <div className="border-r border-border-default pr-6 max-md:border-r-0 max-md:border-b max-md:border-border-default max-md:pr-0 max-md:pb-5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            {rows.map((r) => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: '#555' }}>{r.label}</span>
                  {r.cvr && <span style={{ fontSize: 8, color: '#888', ...EN }}>{r.cvr}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 20, background: '#f0f0f0', overflow: 'hidden' }}>
                    <div style={{ width: `${r.pct}%`, height: '100%', background: r.color }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#171717', minWidth: 52, textAlign: 'right', ...EN }}>
                    {r.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 10px', background: '#fafafa', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, textAlign: 'center' }}>
              {[
                { label: '유입→장바구니', value: '20.25%', red: false },
                { label: '장바구니→구매', value: '7.40%',  red: true  },
                { label: '전체 구매전환율', value: '1.50%', red: false },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontSize: 7, color: '#999', marginBottom: 1 }}>{s.label}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: s.red ? '#ef4444' : '#171717', ...EN }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: AI analysis */}
        <div className="pl-6 max-md:pl-0 max-md:pt-5 flex flex-col justify-center">
          <AIAnalysis title="병목 구간 진단">
            유입→장바구니→구매 3단계 전환율을 <strong>패션 이커머스 업계 평균</strong>과 비교하고,
            가장 큰 이탈 구간을 특정합니다.
          </AIAnalysis>
          <AIAnalysis title="벤치마크 비교">
            단계별 전환율을 <strong>업종 표준 기준</strong>에 대입해 현재 수준을 진단하고,
            개선 시 예상 추가 매출을 역산합니다.
          </AIAnalysis>
          <AIAnalysis title="개선 우선순위">
            전환율 1% 상승 시 <strong>예상 추가 매출을 금액으로 제시</strong>하고,
            단기·중기 실행 액션을 단계별로 안내합니다.
          </AIAnalysis>
        </div>
      </div>
    </div>
  );
}

/* 06 — 매체 성과 및 효율 진단 */
function Ads06Card() {
  const campaigns = [
    { name: 'NGN 인스타 광고 C', roas: '432.1%', ok: true  },
    { name: 'NGN 인스타 광고 E', roas: '410.7%', ok: true  },
    { name: 'NGN 인스타 광고 B', roas: '388.9%', ok: true  },
    { name: 'NGN 인스타 광고 D', roas: '296.8%', ok: false },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 14, flex: 1 }}>
        {campaigns.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 6, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ width: 16, height: 16, background: c.ok ? '#171717' : '#f5f5f5', color: c.ok ? '#fff' : '#999', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...EN }}>{i + 1}</span>
            <span style={{ fontSize: 9, color: '#333', flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: c.ok ? '#0070f3' : '#ef4444', ...EN }}>{c.roas}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <AIAnalysis title="캠페인 효율 비교">
          캠페인별 <strong>ROAS·CPC·CPM</strong>을 순위화하고,
          예산 재배분 시 예상 성과 변화를 계산합니다.
        </AIAnalysis>
        <AIAnalysis title="예산 최적화 제안">
          고효율 캠페인 <strong>증액 비중과 예상 ROAS</strong>를 산출하고,
          저효율 캠페인 조정 또는 중단 기준을 안내합니다.
        </AIAnalysis>
      </div>
    </div>
  );
}

/* 07 — 시장 트렌드와 자사몰 비교 */
function Market07Card() {
  const rows = [
    { label: '가격대',      market: '5~20만원대',                  store: '3~5만원대' },
    { label: '주력 아이템', market: '아우터, 롱슬리브, 와이드 팬츠', store: '플리츠 스커트, 코튼 크루넥' },
    { label: '타겟',        market: '2030 여성, 프리미엄',          store: '데일리웨어, 가성비' },
    { label: '평균 가격',   market: '15만원대',                    store: '5~8만원대' },
    { label: '핵심 소재',   market: '피, 울, 기모, 텐셀',           store: '코튼, 폴리, 기모' },
  ];
  return (
    <div>
      {/* Title */}
      <div className="mx-[-2.5rem] mt-[-2.5rem] px-[2.5rem] max-md:mx-[-1.5rem] max-md:mt-[-2rem] max-md:px-[1.5rem]" style={{ background: '#f0f0f0', borderBottom: '1px solid var(--color-border-default)', minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 400, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-en)', marginBottom: 3 }}>Market Trend</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.25 }}>전월 시장 트렌드와 자사몰 판매상품을 비교 분석합니다.</p>
      </div>
      {/* Top: comparison table */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ border: '1px solid #eaeaea' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 3fr', background: '#1e3a5f', padding: '7px 10px' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>구분</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#93c5fd', ...EN }}>29CM 시장</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#fca5a5' }}>자사몰</span>
          </div>
          {rows.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 3fr', padding: '7px 10px', borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <span style={{ fontSize: 10, color: '#666' }}>{row.label}</span>
              <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 500 }}>{row.market}</span>
              <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 500 }}>{row.store}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom: AI analysis — vertical stack */}
      <div>
        <AIAnalysis title="29CM 시장 트렌드 분석">
          이달 베스트 60개 상품을 <strong>소재·스타일·가격대</strong>로 분류하고,
          전월 대비 급상승 카테고리와 핵심 키워드를 추출합니다.
        </AIAnalysis>
        <AIAnalysis title="자사몰 포지셔닝 갭">
          시장 트렌드와 자사몰 라인업의 <strong>교집합·미진입 영역</strong>을 분석하고,
          가격·소재·스타일 갭을 기회 구간으로 해석합니다.
        </AIAnalysis>
        <AIAnalysis title="다음 달 상품 전략">
          급상승 키워드와 자사몰 재고를 연결해 <strong>강화·신규 도입·단계적 축소</strong>
          상품군을 구체적으로 제안합니다.
        </AIAnalysis>
      </div>
    </div>
  );
}

/* 09 — 액션 플랜 */
function ActionPlan09Card() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginBottom: 14 }}>
        {[
          { title: '이달의 핵심 액션 3가지', body: '매출·광고·트렌드 분석을 종합해 우선순위 높은 실행 과제를 선정합니다. 각 액션에는 예상 효과 지표와 실행 기한이 명시됩니다.' },
          { title: '기획전 · 번들 제안', body: '시장 트렌드와 자사몰 재고를 연결해 이번 달 집중해야 할 기획전 테마와 번들 구성 전략을 추천합니다.' },
        ].map((card, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 0', borderBottom: '1px solid #eaeaea' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', marginBottom: 5 }}>{card.title}</p>
            <p style={{ fontSize: 12, fontWeight: 400, color: '#555', lineHeight: 1.7, margin: 0 }}>{card.body}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ textAlign: 'center', padding: '8px 6px', border: '1px solid #eaeaea', background: '#fafafa' }}>
          <p style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>보수적 시나리오</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#171717', ...EN }}>전월 +5~10%</p>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 6px', border: '1px solid #0070f3', background: 'rgba(0,112,243,0.03)' }}>
          <p style={{ fontSize: 9, color: '#0070f3', marginBottom: 2 }}>도전적 시나리오</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0070f3', ...EN }}>전월 +15~25%</p>
        </div>
      </div>
    </div>
  );
}

function Section02() {
  return (
    <Section alt>

      {/* ━━━ ROW 1: 5fr 텍스트 + 7fr Market07 ━━━ */}
      <div className="grid grid-cols-[5fr_7fr] max-md:grid-cols-1 border-b border-border-default">
        {/* LEFT — 다크 그라데이션 (헤더 네이비와 연결) */}
        <div
          className="max-md:border-b max-md:border-border-default"
          style={{ background: 'linear-gradient(to bottom, #0a1e3d, #0a0a0a)' }}
        >
          <FadeUp className="px-10 py-14 flex flex-col justify-center max-md:px-6 max-md:pb-8">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-[#171717] bg-white" style={EN}>02</span>
              <div className="w-10 h-px bg-white/20" />
            </div>
            <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-white tracking-[-0.02em] leading-[1.25] mb-5">
              NGN 마케터의 기준으로<br />매월 1일, 전략 리포트
            </h3>
            <p className="text-[15px] leading-[1.6] tracking-[-0.02em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              단순 성과 집계가 아닙니다. NGN 마케터가 설계한 분석 기준으로<br className="max-md:hidden" />
              GEMINI가 데이터를 해석하고 다음 달 전략을 제시합니다.
            </p>
          </FadeUp>
        </div>
        {/* RIGHT */}
        <div className="border-l border-border-default">
          <FadeUp delay={0.1} className="px-10 py-10 max-md:px-6 max-md:py-8">
            <Market07Card />
          </FadeUp>
        </div>
      </div>

      {/* ━━━ ROW 2: Funnel03 전체 너비 ━━━
          border-b 는 plain wrapper div 에 → FadeUp willChange 오프셋 방지 */}
      <div className="border-b border-border-default">
        <FadeUp className="px-10 py-10 max-md:px-6 max-md:py-8">
          <Funnel03Card />
        </FadeUp>
      </div>

      {/* ━━━ ROW 3: 3열 그리드
          DOM 순서: 타이틀1→콘텐츠1→타이틀2→콘텐츠2→타이틀3→콘텐츠3 (모바일 자연 흐름)
          데스크톱: md:col/row-start 로 2행 배치 */}
      <div className="grid grid-cols-3 max-md:grid-cols-1">

        {/* ── Col 1: Sales Analysis ── */}
        <div
          className="md:col-start-1 md:row-start-1 px-8 flex flex-col justify-center border-b border-border-default"
          style={{ minHeight: 96, background: '#f0f0f0' }}
        >
          <p style={{ fontSize: 10, fontWeight: 400, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-en)', marginBottom: 3 }}>Sales Analysis</p>
          <p className="text-[20px] md:text-[16px]" style={{ fontWeight: 700, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.25 }}>지난달 매출 성과를 분해하고 원인을 진단합니다.</p>
        </div>
        <div className="flex flex-col md:col-start-1 md:row-start-2 max-md:border-b max-md:border-border-default">
          <FadeUp className="flex-1 px-8 pt-5 pb-10 flex flex-col">
            <Sales01Card />
          </FadeUp>
        </div>

        {/* ── Col 2: Ad Performance (세로선: border-l) ── */}
        <div
          className="md:col-start-2 md:row-start-1 px-8 flex flex-col justify-center border-b border-border-default md:border-l"
          style={{ minHeight: 96, background: '#f0f0f0' }}
        >
          <p style={{ fontSize: 10, fontWeight: 400, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-en)', marginBottom: 3 }}>Ad Performance</p>
          <p className="text-[20px] md:text-[16px]" style={{ fontWeight: 700, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.25 }}>Meta·Google 광고 효율을 진단합니다.</p>
        </div>
        <div className="flex flex-col md:col-start-2 md:row-start-2 md:border-l md:border-border-default max-md:border-b max-md:border-border-default">
          <FadeUp delay={0.08} className="flex-1 px-8 pt-5 pb-10 flex flex-col">
            <Ads06Card />
          </FadeUp>
        </div>

        {/* ── Col 3: Action Plan (세로선: border-l) ── */}
        <div
          className="md:col-start-3 md:row-start-1 px-8 flex flex-col justify-center border-b border-border-default md:border-l"
          style={{ minHeight: 96, background: '#f0f0f0' }}
        >
          <p style={{ fontSize: 10, fontWeight: 400, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-en)', marginBottom: 3 }}>Action Plan</p>
          <p className="text-[20px] md:text-[16px]" style={{ fontWeight: 700, color: '#171717', letterSpacing: '-0.03em', lineHeight: 1.25 }}>다음 달을 위한 핵심 실행 전략을 제안합니다.</p>
        </div>
        <div className="flex flex-col md:col-start-3 md:row-start-2 md:border-l md:border-border-default">
          <FadeUp delay={0.16} className="flex-1 px-8 pt-5 pb-10 flex flex-col">
            <ActionPlan09Card />
          </FadeUp>
        </div>

      </div>

    </Section>
  );
}

/* ================================================================
   SECTION 03 — Mobile: Modern iPhone + Auto-Scroll Yoyo
   ================================================================ */
function Section03() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section>
      <div ref={ref} className="pt-20 px-12 pb-12 max-w-[1080px] mx-auto max-md:pt-10 max-md:px-6 max-md:pb-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-[2fr_3fr] gap-12 items-center max-md:grid-cols-1 max-md:gap-8"
        >
          {/* LEFT: Text */}
          <motion.div variants={staggerContainer} className="max-md:order-first">
            <motion.div variants={springPop} className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white bg-[#171717] shrink-0" style={EN}>03</span>
              <div className="flex-1 h-px bg-[#eaeaea]" />
            </motion.div>
            <motion.h3 variants={springPop} className="text-[clamp(22px,3vw,30px)] font-bold text-[#171717] tracking-[-0.02em] leading-[1.25] mb-4">
              언제 어디서든 관리
            </motion.h3>
            <motion.p variants={springPop} className="text-[15px] text-[#333] leading-[1.7] mb-5">
              외근 중에도, 이동 중에도. 매출과 광고 성과를 확인하고, 트렌드를 파악하고, 예산을 바로 조정합니다.
            </motion.p>
            {[
              '매출·광고 핵심 성과 확인',
              '시장 트렌드 리포트',
              '광고 예산 실시간 변경',
            ].map((item) => (
              <motion.div key={item} variants={springPop} className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-accent shrink-0" />
                <span className="text-[14px] text-[#444]">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT: Modern iPhone Mockup with Auto-Scroll */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="flex justify-center"
          >
            {/* iPhone frame */}
            <div
              className="iphone-frame relative max-md:max-w-[280px]"
              style={{
                width: 284,
                background: 'linear-gradient(155deg, #3a3a3a 0%, #242424 45%, #1a1a1a 100%)',
                padding: '16px 10px 10px',
                boxShadow: '0 28px 64px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 0.5px rgba(255,255,255,0.07)',
              }}
            >
              {/* Frame gloss — 프레임 자체 상단 광택 */}
              <div
                className="iphone-frame absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, transparent 45%)', zIndex: 0 }}
              />

              {/* Volume buttons */}
              <div className="absolute" style={{ left: -3, top: 88, width: 3, height: 26, background: '#2a2a2a', borderRadius: 2 }} />
              <div className="absolute" style={{ left: -3, top: 122, width: 3, height: 26, background: '#2a2a2a', borderRadius: 2 }} />
              {/* Power button */}
              <div className="absolute" style={{ right: -3, top: 108, width: 3, height: 50, background: '#2a2a2a', borderRadius: 2 }} />

              {/* Dynamic island */}
              <div className="rounded-full mx-auto mb-2" style={{ width: 72, height: 20, background: '#000', position: 'relative', zIndex: 1 }} />

              {/* Screen */}
              <div className="relative" style={{ position: 'relative', zIndex: 1 }}>
                <div className="iphone-screen overflow-hidden" style={{ height: 520, background: '#e8eaef', position: 'relative' }}>
                {/* Glass — 하단 vignette (정적) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 50,
                    background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.07) 100%)',
                  }}
                />
                {/* Glass — 스윕 글레어 (움직이는 빛 반사) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 51 }}>
                  <div
                    className="animate-glass-glare"
                    style={{
                      position: 'absolute',
                      top: '-30%',
                      left: 0,
                      width: '38%',
                      height: '160%',
                      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5) 50%, transparent)',
                    }}
                  />
                </div>
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
                      { name: '울 블렌드 코트', qty: 24, amount: '1.8M' },
                      { name: '와이드 슬랙스', qty: 18, amount: '1.4M' },
                      { name: '리브 니트 탑', qty: 15, amount: '1.1M' },
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                      {[
                        { tag: 'META', color: '#1877f2', img: '/img/unsplash/webp/photo-1515886657613-9f3515b0c78f.webp', campaign: 'Spring Sale', roas: '1,024%' },
                        { tag: 'GOOGLE', color: '#34a853', img: '/img/unsplash/webp/photo-1539109136881-3be0616acf4b.webp', campaign: 'Brand KW', roas: '412%' },
                      ].map((r) => (
                        <div key={r.tag} style={{ border: '1px solid #eaeaea', overflow: 'hidden' }}>
                          <div style={{ height: 64, backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center top', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 4 }}>
                            <span style={{ fontSize: 6, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.45)', padding: '1px 4px', ...EN }}>Sponsored</span>
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
                </div>{/* iphone-screen */}
              </div>

              {/* Home indicator */}
              <div className="flex items-center justify-center" style={{ height: 24, position: 'relative', zIndex: 1 }}>
                <div className="iphone-home" style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.25)' }} />
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
      <Section id="dashboard" dark>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 25% 0%, #0a2050 0%, #0a0a0a 60%)' }} />
        <div className="relative grid grid-cols-[7fr_5fr] max-md:grid-cols-1">

          {/* LEFT */}
          <div className="relative flex flex-col [box-shadow:1px_0_0_rgba(255,255,255,0.12)] max-md:[box-shadow:none] max-md:border-b max-md:border-[rgba(255,255,255,0.12)]">
            <FadeUp className="flex-1 flex flex-col">
              <div className="flex-1 px-12 py-12 md:py-20 flex flex-col justify-center items-center text-center gap-7 max-md:px-6 max-md:py-10">
                <p
                  className="leading-[0.9] tracking-[-0.01em] text-white select-none"
                  style={{ fontSize: 'clamp(44px, 6vw, 72px)', fontFamily: "'Inter Tight', sans-serif", fontWeight: 800 }}
                >
                  Dashboard
                </p>
                <a
                  href="https://board.nugoona.co.kr/demo/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-pill inline-flex items-center justify-between gap-4 bg-white pl-6 pr-2 py-2 hover:bg-[#f0f0f0] transition-colors duration-200 max-w-[280px] w-full"
                >
                  <span className="text-[14px] font-bold text-[#171717] tracking-[-0.01em]">직접 데모 경험하기</span>
                  <span className="rounded-dot w-9 h-9 bg-[#171717] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h8M9 5l3 3-3 3" /></svg>
                  </span>
                </a>
              </div>
            </FadeUp>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col">
            <FadeUp delay={0.1} className="flex-1 flex flex-col">
              <div className="flex-1 px-12 py-12 md:py-20 flex flex-col justify-center max-md:px-6 max-md:py-10">
                <p className="text-[13px] font-semibold text-accent tracking-[0.1em] uppercase mb-4" style={EN}>Dashboard</p>
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold text-white tracking-[-0.03em] leading-[1.15] mb-4">
                  매출·광고·방문자 데이터를<br />한 화면에서
                </h2>
                <p className="text-[15px] leading-[1.6] mb-6 font-light tracking-[-0.02em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  카페24 매출, 메타·구글 광고, GA4 방문자 — 하나의 대시보드에서 실시간 확인.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Cafe24 API', 'Google GA4', 'Meta Ads API', 'Gemini 2.0 Pro'].map((tag) => (
                    <span key={tag} className="text-[10px] font-medium px-2.5 py-1" style={{ background: '#fff', color: '#111', ...EN }}>{tag}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

        </div>
      </Section>

      <Section01 />
      <Section02 />
      <Section03 />
    </>
  );
}
