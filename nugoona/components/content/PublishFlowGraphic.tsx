'use client';

/**
 * PublishFlowGraphic — 콘텐츠 /content S4 "발행" 상징 그래픽
 * 실제 프로세스(ngn_upload 정본)를 좌→우 순차 흐름으로:
 *   ①입력(사진·음성·메모 3종) → ②Claude 처리(Q&A 되묻기 + 글·썸네일 생성)
 *   → ③검토·승인 게이트(★이 단계만 사람) → ④발행 갈래(네이버·플레이스·인스타·구글 fan-out)
 *   → ⑤검색 노출(결과에 보임).
 * 관통 메시지: "사장님은 사진·메모만, 나머지는 자동 — 검토만 사람."
 *
 * ⛔ DataPipelineVisual(5소스 수렴형) 베끼기 금지. 이건 순차 레인 + 게이트 + fan-out.
 * 시각문법: 흐린 뼈대 · 개념만 accent(#0070f3) · 흐름 화살표/갈래
 *   · useInView pathLength draw · 점 흐름 · 절제. framer-motion + 순수 SVG(신규 라이브러리 0).
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';
const LINE = '#c8c8c8'; // 연결 화살표(뼈대)
const NODE_STROKE = '#cfcfcf';
const NODE_FILL = '#ffffff';
const SKEL = '#e6e6e6';
const TXT = '#9a9a9a';
const ICON = '#bcbcbc';

const CHANNELS = ['네이버', '플레이스', '인스타', '구글'];

/* 진입 draw 되는 연결선(회색) + 화살촉 */
function FlowLine({ d, inView, delay }: { d: string; inView: boolean; delay: number }) {
  return (
    <motion.path
      d={d} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke"
      markerEnd="url(#pf-arrow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={inView ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay }}
    />
  );
}

/* 입력 인풋 아이콘(회색) */
function InputIcon({ kind, x, y }: { kind: 'photo' | 'voice' | 'memo'; x: number; y: number }) {
  if (kind === 'photo')
    return (
      <g stroke={ICON} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        <rect x={x - 6} y={y - 5} width="12" height="10" />
        <circle cx={x - 2.5} cy={y - 1.5} r="1.2" fill={ICON} stroke="none" />
        <path d={`M${x - 6},${y + 5} L${x - 1},${y} L${x + 2},${y + 2.5} L${x + 6},${y - 1} L${x + 6},${y + 5} Z`} fill={ICON} stroke="none" />
      </g>
    );
  if (kind === 'voice')
    return (
      <g stroke={ICON} strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinecap="round">
        {[-4, -1.3, 1.3, 4].map((dx, i) => {
          const h = [4, 7, 5, 3][i];
          return <line key={i} x1={x + dx} y1={y - h} x2={x + dx} y2={y + h} />;
        })}
      </g>
    );
  return (
    <g stroke={ICON} strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinecap="round">
      {[-3.5, 0, 3.5].map((dy, i) => <line key={i} x1={x - 6} y1={y + dy} x2={x + (i === 2 ? 2 : 6)} y2={y + dy} />)}
    </g>
  );
}

/* 검토 게이트 — 유일한 사람 단계(accent). 사람 아이콘 + 체크 + pulse */
function ReviewGate({ cx, cy, inView }: { cx: number; cy: number; inView: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {inView && (
        <circle cx={cx} cy={cy} r="24" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0">
          <animate attributeName="r" values="24;32" dur="2.4s" begin="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0" dur="2.4s" begin="1.4s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={cx} cy={cy} r="24" fill="#eaf2ff" stroke={ACCENT} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      {/* 사람 아이콘(머리+어깨) */}
      <circle cx={cx} cy={cy - 6} r="4" fill={ACCENT} />
      <path d={`M${cx - 8},${cy + 8} a8,8 0 0 1 16,0`} fill={ACCENT} />
      {/* 체크 배지 */}
      <circle cx={cx + 15} cy={cy + 14} r="7" fill={ACCENT} />
      <path d={`M${cx + 11.5},${cy + 14} l2.2,2.4 l4.2,-5`} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  );
}

/* 흐르는 점(자동 흐름) */
function FlowDots({ ids, inView }: { ids: { id: string; dur: number; begin: number }[]; inView: boolean }) {
  if (!inView) return null;
  return (
    <>
      {ids.map(({ id, dur, begin }) => (
        <circle key={id} r="2.6" fill={ACCENT}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`}>
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ))}
    </>
  );
}

/* ─────────────────── 데스크톱: 좌→우 순차 ─────────────────── */
function DesktopFlow({ inView }: { inView: boolean }) {
  const MID = 130;
  const inputs: ['photo' | 'voice' | 'memo', string, number][] = [
    ['photo', '사진', 96], ['voice', '음성', 130], ['memo', '메모', 164],
  ];
  // 입력 merge elbow
  const mergeIn = (cy: number) => cy === MID ? `M98,${MID}H150` : `M98,${cy}H120V${MID}H150`;
  const seg2 = 'M262,130H281';       // Claude → 검토
  const seg3 = 'M329,130H372';       // 검토 → 분기
  const chYs = [70, 110, 150, 190];
  const fan = (cy: number) => `M372,130H389V${cy}H406`;  // 분기 → 채널
  const seg5 = 'M498,130H524';       // 채널그룹 → 검색결과

  return (
    <svg viewBox="0 0 760 280" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden>
      <defs>
        <marker id="pf-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={LINE} />
        </marker>
        {inputs.map(([, , cy], i) => <path key={i} id={`pf-in${i}`} d={mergeIn(cy)} />)}
        <path id="pf-s2" d={seg2} /><path id="pf-s3" d={seg3} /><path id="pf-s5" d={seg5} />
        {chYs.map((cy, i) => <path key={i} id={`pf-fan${i}`} d={fan(cy)} />)}
      </defs>

      {/* 연결선 draw */}
      {inputs.map(([, , cy], i) => <FlowLine key={i} d={mergeIn(cy)} inView={inView} delay={0.1 + i * 0.05} />)}
      <FlowLine d={seg2} inView={inView} delay={0.5} />
      <FlowLine d={seg3} inView={inView} delay={0.7} />
      {chYs.map((cy, i) => <FlowLine key={i} d={fan(cy)} inView={inView} delay={0.9 + i * 0.06} />)}
      <FlowLine d={seg5} inView={inView} delay={1.2} />

      {/* ① 입력 3종 */}
      {inputs.map(([kind, label, cy], i) => (
        <motion.g key={label}
          initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}>
          <rect x="14" y={cy - 15} width="84" height="30" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <InputIcon kind={kind} x={30} y={cy} />
          <text x="46" y={cy + 4} fontSize="11" fontWeight="600" fill={TXT}>{label}</text>
        </motion.g>
      ))}
      <text x="56" y="196" textAnchor="middle" fontSize="8.5" fill="#b0b0b0">사장님이 올리는 것</text>

      {/* ② Claude 처리 */}
      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}>
        <rect x="150" y="98" width="112" height="64" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <text x="158" y="112" fontSize="9" fontWeight="700" fill={ACCENT} fontFamily="var(--font-en)">Claude</text>
        {/* Q&A 되묻기(두 말풍선 + 순환 화살표) */}
        <rect x="158" y="120" width="18" height="9" rx="0" fill={SKEL} />
        <rect x="180" y="132" width="18" height="9" fill={SKEL} />
        <path d="M200,124 a6,6 0 1 1 -3,-5" fill="none" stroke={ICON} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M197,117 l1,3 l-3,0 z" fill={ICON} />
        {/* 생성물: 글 라인 + 4:5 이미지 */}
        <rect x="208" y="120" width="30" height="3" fill={SKEL} />
        <rect x="208" y="127" width="26" height="3" fill={SKEL} />
        <rect x="208" y="134" width="30" height="3" fill={SKEL} />
        <rect x="242" y="120" width="14" height="18" fill="#f0f0f0" stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <text x="206" y="150" fontSize="8" fill="#b0b0b0">글·썸네일 자동 작성</text>
      </motion.g>

      {/* ③ 검토 게이트(사람) */}
      <ReviewGate cx={305} cy={130} inView={inView} />
      <text x="305" y="170" textAnchor="middle" fontSize="9" fontWeight="700" fill={ACCENT}>검토·승인</text>
      <text x="305" y="182" textAnchor="middle" fontSize="8" fill="#b0b0b0">이 단계만 사람</text>

      {/* 스케줄 배지 (검토→분기 화살표 위) */}
      <g>
        <rect x="336" y="112" width="60" height="13" fill="#f5f5f5" stroke="#e5e5e5" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <text x="366" y="121" textAnchor="middle" fontSize="7.5" fill={TXT}>즉시 · 예약</text>
      </g>

      {/* ④ 발행 갈래 */}
      {CHANNELS.map((ch, i) => (
        <motion.g key={ch}
          initial={{ opacity: 0, x: 8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE, delay: 0.95 + i * 0.06 }}>
          <rect x="406" y={chYs[i] - 13} width="92" height="26" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <circle cx="420" cy={chYs[i]} r="2" fill={ICON} />
          <text x="432" y={chYs[i] + 4} fontSize="10" fontWeight="600" fill={TXT}>{ch}</text>
        </motion.g>
      ))}

      {/* ⑤ 검색 노출 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 1.25 }}>
        <rect x="524" y="76" width="220" height="108" fill={NODE_FILL} stroke="#eaeaea" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        {/* 검색바 */}
        <rect x="536" y="88" width="196" height="20" fill="#fafafa" stroke="#eee" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <circle cx="548" cy="98" r="4" fill="none" stroke={ICON} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <line x1="551" y1="101" x2="554" y2="104" stroke={ICON} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <rect x="560" y="95" width="70" height="6" fill={SKEL} />
        {/* 결과: 최상단 = 내 글 accent 하이라이트 */}
        <rect x="536" y="116" width="196" height="20" fill="#eaf2ff" stroke={ACCENT} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx="546" cy="126" r="2.5" fill={ACCENT} />
        <rect x="554" y="123" width="120" height="6" fill={ACCENT} opacity="0.55" />
        <rect x="536" y="142" width="196" height="15" fill="none" />
        <rect x="546" y="146" width="150" height="5" fill={SKEL} />
        <rect x="546" y="162" width="130" height="5" fill={SKEL} />
        <text x="536" y="178" fontSize="8" fill="#b0b0b0">검색에 우리 스토어가 보입니다</text>
      </motion.g>

      {/* 흐르는 점(자동) */}
      <FlowDots inView={inView} ids={[
        { id: 'pf-in1', dur: 1.2, begin: 0.6 },
        { id: 'pf-s2', dur: 0.9, begin: 1.0 },
        { id: 'pf-s3', dur: 0.9, begin: 1.3 },
        { id: 'pf-fan0', dur: 1.1, begin: 1.6 }, { id: 'pf-fan1', dur: 1.1, begin: 1.75 },
        { id: 'pf-fan2', dur: 1.1, begin: 1.9 }, { id: 'pf-fan3', dur: 1.1, begin: 2.05 },
        { id: 'pf-s5', dur: 0.9, begin: 2.2 },
      ]} />
    </svg>
  );
}

/* ─────────────────── 모바일: 위→아래 순차 ─────────────────── */
function MobileFlow({ inView }: { inView: boolean }) {
  const inputs: ['photo' | 'voice' | 'memo', string, number][] = [
    ['photo', '사진', 20], ['voice', '음성', 130], ['memo', '메모', 240],
  ];
  const inX = (i: number) => inputs[i][2];
  const mergeIn = (i: number) => { const cx = inX(i) + 50; return cx === 170 ? `M170,46V80` : `M${cx},46V64H170V80`; };
  const s2 = 'M170,146V168';   // Claude → 검토
  const s3 = 'M170,216V240';   // 검토 → 분기
  const chPos = [[20, 262], [180, 262], [20, 300], [180, 300]];
  const fan = (x: number, y: number) => `M170,240V${y - 14 < 250 ? 250 : y - 14}H${x + 70}V${y - 14}`;
  const s5 = 'M170,342V366';   // 발행 → 검색

  return (
    <svg viewBox="0 0 340 540" style={{ width: '100%', height: 'auto', display: 'block' }} aria-hidden>
      <defs>
        <marker id="pfm-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={LINE} />
        </marker>
        {inputs.map((_, i) => <path key={i} id={`pfm-in${i}`} d={mergeIn(i)} />)}
        <path id="pfm-s2" d={s2} /><path id="pfm-s3" d={s3} /><path id="pfm-s5" d={s5} />
        {chPos.map(([x, y], i) => <path key={i} id={`pfm-fan${i}`} d={fan(x, y)} />)}
      </defs>

      {/* 연결선 (모바일 화살촉) */}
      {inputs.map((_, i) => (
        <motion.path key={i} d={mergeIn(i)} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" markerEnd="url(#pfm-arrow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.05 }} />
      ))}
      {[[s2, 0.6], [s3, 0.9]].map(([d, dl], i) => (
        <motion.path key={i} d={d as string} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" markerEnd="url(#pfm-arrow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.55, ease: EASE, delay: dl as number }} />
      ))}
      {chPos.map(([x, y], i) => (
        <motion.path key={i} d={fan(x, y)} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" markerEnd="url(#pfm-arrow)"
          initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.55, ease: EASE, delay: 1.05 + i * 0.06 }} />
      ))}
      <motion.path d={s5} fill="none" stroke={LINE} strokeWidth="1.4" vectorEffect="non-scaling-stroke" markerEnd="url(#pfm-arrow)"
        initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 0.55, ease: EASE, delay: 1.3 }} />

      {/* ① 입력 3종 (가로) */}
      {inputs.map(([kind, label], i) => (
        <motion.g key={label} initial={{ opacity: 0, y: -6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}>
          <rect x={inX(i)} y="8" width="100" height="30" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <InputIcon kind={kind} x={inX(i) + 18} y={23} />
          <text x={inX(i) + 34} y="27" fontSize="11" fontWeight="600" fill={TXT}>{label}</text>
        </motion.g>
      ))}

      {/* ② Claude */}
      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}>
        <rect x="110" y="84" width="120" height="62" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <text x="118" y="100" fontSize="9" fontWeight="700" fill={ACCENT} fontFamily="var(--font-en)">Claude</text>
        <rect x="118" y="108" width="18" height="9" fill={SKEL} />
        <rect x="140" y="120" width="18" height="9" fill={SKEL} />
        <path d="M160,112 a6,6 0 1 1 -3,-5" fill="none" stroke={ICON} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <rect x="170" y="108" width="30" height="3" fill={SKEL} /><rect x="170" y="115" width="26" height="3" fill={SKEL} /><rect x="170" y="122" width="30" height="3" fill={SKEL} />
        <rect x="204" y="108" width="14" height="18" fill="#f0f0f0" stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <text x="118" y="140" fontSize="7.5" fill="#b0b0b0">글·썸네일 자동 작성</text>
      </motion.g>

      {/* ③ 검토 */}
      <ReviewGate cx={170} cy={192} inView={inView} />
      <text x="210" y="188" fontSize="9" fontWeight="700" fill={ACCENT}>검토·승인</text>
      <text x="210" y="200" fontSize="8" fill="#b0b0b0">이 단계만 사람</text>

      {/* ④ 발행 갈래 (2x2) */}
      {CHANNELS.map((ch, i) => {
        const [x, y] = chPos[i];
        return (
          <motion.g key={ch} initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, ease: EASE, delay: 1.05 + i * 0.06 }}>
            <rect x={x} y={y - 14} width="140" height="28" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            <circle cx={x + 16} cy={y} r="2" fill={ICON} />
            <text x={x + 28} y={y + 4} fontSize="10" fontWeight="600" fill={TXT}>{ch}</text>
          </motion.g>
        );
      })}

      {/* ⑤ 검색 노출 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE, delay: 1.3 }}>
        <rect x="30" y="366" width="280" height="150" fill={NODE_FILL} stroke="#eaeaea" strokeWidth="1px" vectorEffect="non-scaling-stroke" />
        <rect x="44" y="380" width="252" height="24" fill="#fafafa" stroke="#eee" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <circle cx="58" cy="392" r="4.5" fill="none" stroke={ICON} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <line x1="61.5" y1="395.5" x2="65" y2="399" stroke={ICON} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <rect x="74" y="388" width="90" height="7" fill={SKEL} />
        <rect x="44" y="414" width="252" height="24" fill="#eaf2ff" stroke={ACCENT} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx="56" cy="426" r="3" fill={ACCENT} />
        <rect x="66" y="422" width="150" height="7" fill={ACCENT} opacity="0.55" />
        <rect x="56" y="448" width="180" height="6" fill={SKEL} /><rect x="56" y="464" width="150" height="6" fill={SKEL} />
        <text x="44" y="492" fontSize="8" fill="#b0b0b0">검색에 우리 스토어가 보입니다</text>
      </motion.g>

      <FlowDots inView={inView} ids={[
        { id: 'pfm-in1', dur: 1.2, begin: 0.6 },
        { id: 'pfm-s2', dur: 0.9, begin: 1.0 }, { id: 'pfm-s3', dur: 0.9, begin: 1.3 },
        { id: 'pfm-fan0', dur: 1.1, begin: 1.6 }, { id: 'pfm-fan1', dur: 1.1, begin: 1.75 },
        { id: 'pfm-fan2', dur: 1.1, begin: 1.9 }, { id: 'pfm-fan3', dur: 1.1, begin: 2.05 },
        { id: 'pfm-s5', dur: 0.9, begin: 2.3 },
      ]} />
    </svg>
  );
}

export default function PublishFlowGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div className="hidden md:block"><DesktopFlow inView={inView} /></div>
      <div className="md:hidden"><MobileFlow inView={inView} /></div>
    </div>
  );
}
