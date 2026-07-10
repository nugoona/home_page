'use client';

/**
 * S1_IllustrationHero — 재사용 스타일 라이브러리 [스타일①: 큰 일러스트 1컷 은유]
 *
 * 표현 개념(누구나 콘텐츠): "사진 올리면 → AI가 글 자동 발행 → 검색에 노출된다"
 *
 * ▶ 스타일① 정의 = 설명 문장·화살표·박스·단계 없이 "그림 한 장이 곧 핵심".
 *   한 장면: 아래에서 손이 폴라로이드 사진을 들어올리자, 그 사진에서 글(텍스트 조각)이
 *   위로 "피어올라" 상단의 검색창 안으로 흡수되고, 우리 가게 결과가 켜진다.
 *   화살표·연결선 없이 "위로 피어오르는" 단일 상승 제스처만으로 흐름을 읽게 한다.
 *   → 뇌가 "읽지" 않고 "본다". 중학생도 5초.
 *
 * ⛔ 노드+연결선 다이어그램 금지(사장님 반려 = PublishFlowGraphic 계열). 이건 그거 아님.
 * 톤: 미니멀 모노크롬 + accent(#0070f3) 절제 강조 + 직각(브랜드). unDraw 톤을 인라인 SVG로 재현.
 * 기술: framer-motion(useInView 은은한 진입) + 순수 inline SVG. 신규 라이브러리 0.
 * 반응형: 단일 스케일 SVG(width 100%, height auto) — 데스크/모바일 모두 비율 유지, max-width로 중앙.
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = '#0070f3';
const ACCENT_SOFT = '#eaf2ff';
const SKIN = '#e9edf1';        // 손 채움(중립 쿨그레이 = 모노크롬)
const SKIN_LINE = '#ccd3da';   // 손 외곽
const PAPER = '#ffffff';
const PAPER_LINE = '#e3e3e6';
const SKEL = '#e7e7ea';        // 텍스트/이미지 스켈레톤
const SKEL_D = '#d7d7db';
const CHROME = '#f6f7f9';

/* ───────── 반짝임(피어오르는 상승 은유) — 4각 별, 은은한 트윙클 ───────── */
function Sparkle({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  const d = `M0,${-s} L${s * 0.24},${-s * 0.24} L${s},0 L${s * 0.24},${s * 0.24} L0,${s} L${-s * 0.24},${s * 0.24} L${-s},0 L${-s * 0.24},${-s * 0.24} Z`;
  // 위치는 부모 <g transform>이 잡고, motion은 로컬 scale/y/opacity만
  // (SVG에서 transform attribute와 CSS transform을 한 요소에 함께 주면 충돌 → 분리)
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.path
        d={d}
        fill={ACCENT}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0.45, 1, 0.45], scale: [0, 1.1, 0.85, 1.05, 0.9], y: [6, -4] }}
        transition={{
          duration: 3.2,
          delay,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </g>
  );
}

/* ───────── 피어오르는 "글 조각" 카드 — 사진에서 텍스트로 변태(morph) ───────── */
function BloomChip({
  x, y, w, rot, lines, delay, inView,
}: { x: number; y: number; w: number; rot: number; lines: number; delay: number; inView: boolean }) {
  const pad = 9;
  const lh = 8;
  const h = pad * 2 + lines * lh + (lines - 1) * 4;
  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      initial={{ opacity: 0, y: 20, scale: 0.94, rotate: rot }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotate: rot } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke={PAPER_LINE} strokeWidth="1" />
      {/* 종이 그림자 살짝(입체) */}
      <rect x={x + 2.5} y={y + h} width={w - 5} height="3" fill="#000" opacity="0.04" />
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        return (
          <rect
            key={i}
            x={x + pad}
            y={y + pad + i * (lh + 4)}
            width={(w - pad * 2) * (isLast ? 0.55 : 1)}
            height={lh}
            fill={i === 0 ? SKEL_D : SKEL}
          />
        );
      })}
    </motion.g>
  );
}

/* ───────── 손가락 캡슐(2겹 = 외곽선 있는 플랫 손) ───────── */
function Finger({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={SKIN_LINE} strokeWidth="18" strokeLinecap="round" />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={SKIN} strokeWidth="15" strokeLinecap="round" />
    </>
  );
}

export default function S1_IllustrationHero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
      <svg
        viewBox="0 0 440 580"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="사진을 올리면 AI가 글을 써서 검색에 노출되는 과정을 표현한 일러스트"
      >
        <defs>
          {/* 상승 방향 통일감을 주는 아주 옅은 accent 기류(화살표 아님, 분위기용) */}
          <radialGradient id="s1-updraft" cx="50%" cy="100%" r="75%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.10" />
            <stop offset="55%" stopColor={ACCENT} stopOpacity="0.04" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s1-photo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe8f4" />
            <stop offset="100%" stopColor="#eef3fa" />
          </linearGradient>
        </defs>

        {/* 배경 기류 — 아래(손)에서 위(검색)로 은은히 피어오르는 톤 */}
        <ellipse cx="216" cy="330" rx="150" ry="210" fill="url(#s1-updraft)" />

        {/* ══════════ ① 상단: 검색 브라우저 (결과가 "뜬다") ══════════ */}
        <motion.g
          initial={{ opacity: 0, y: -14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
        >
          {/* 창 */}
          <rect x="46" y="22" width="348" height="176" fill={PAPER} stroke="#e6e6e9" strokeWidth="1.5" />
          {/* 크롬 바 */}
          <rect x="46" y="22" width="348" height="30" fill={CHROME} stroke="#ededf0" strokeWidth="1" />
          <circle cx="62" cy="37" r="3.2" fill="#dfe0e4" />
          <circle cx="74" cy="37" r="3.2" fill="#dfe0e4" />
          <circle cx="86" cy="37" r="3.2" fill="#dfe0e4" />
          {/* 검색 입력 바 */}
          <rect x="66" y="64" width="308" height="26" fill="#fbfbfc" stroke="#ececef" strokeWidth="1" />
          <circle cx="82" cy="77" r="5.5" fill="none" stroke="#b9bcc2" strokeWidth="1.8" />
          <line x1="86" y1="81" x2="90.5" y2="85.5" stroke="#b9bcc2" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="98" y="74" width="120" height="6" fill={SKEL} />

          {/* 우리 가게 결과 = 검색에 노출 (accent로 "켜진다") */}
          {inView && (
            <rect x="66" y="102" width="308" height="34" fill="none" stroke={ACCENT} strokeWidth="1.4" opacity="0">
              <animate attributeName="x" values="66;60" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
              <animate attributeName="y" values="102;99" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
              <animate attributeName="width" values="308;320" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
              <animate attributeName="height" values="34;40" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
            </rect>
          )}
          <motion.g
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 1.35 }}
          >
            <rect x="66" y="102" width="308" height="34" fill={ACCENT_SOFT} stroke={ACCENT} strokeWidth="1.4" />
            {/* 노출 표시 배지(체크 = 검색에 노출됨, 등수 아님) */}
            <rect x="74" y="110" width="18" height="18" fill={ACCENT} />
            <text x="83" y="123.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="var(--font-en)">✓</text>
            {/* 위치 핀 */}
            <path d="M108,111 a6,6 0 0 1 12,0 c0,4.6 -6,10 -6,10 c0,0 -6,-5.4 -6,-10 Z" fill={ACCENT} />
            <circle cx="114" cy="117" r="2.2" fill="#fff" />
            {/* 가게명(accent 라인) + 별점 */}
            <rect x="128" y="110" width="132" height="7" fill={ACCENT} opacity="0.55" />
            <g fill={ACCENT}>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={130 + i * 9} cy={126} r={2.4} opacity={0.85} />
              ))}
            </g>
          </motion.g>

          {/* 다른 결과 = 회색 스켈레톤(대비) */}
          <rect x="74" y="148" width="10" height="10" fill={SKEL_D} />
          <rect x="94" y="149" width="180" height="7" fill={SKEL} />
          <rect x="74" y="170" width="10" height="10" fill={SKEL_D} />
          <rect x="94" y="171" width="150" height="7" fill={SKEL} />
        </motion.g>

        {/* ══════════ ② 중단: 사진 → 글로 "피어오름" (텍스트 조각 상승) ══════════ */}
        <BloomChip x={150} y={300} w={150} rot={-4} lines={2} delay={0.5} inView={inView} />
        <BloomChip x={182} y={262} w={116} rot={3} lines={2} delay={0.68} inView={inView} />
        <BloomChip x={206} y={232} w={90} rot={-3} lines={1} delay={0.86} inView={inView} />

        {/* 상승 반짝임(피어오르는 입자) — inView일 때만 재생 */}
        {inView && (
          <>
            <Sparkle x={132} y={300} s={6} delay={0.2} />
            <Sparkle x={310} y={278} s={4.5} delay={0.9} />
            <Sparkle x={168} y={244} s={5} delay={0.5} />
            <Sparkle x={300} y={222} s={6} delay={1.3} />
            <Sparkle x={214} y={206} s={4} delay={0.75} />
            <Sparkle x={126} y={356} s={5} delay={1.05} />
            {/* 손끝 ↔ 떠오른 사진 사이(막 튕겨 올라간 궤적) */}
            <Sparkle x={196} y={422} s={4.5} delay={0.35} />
            <Sparkle x={252} y={410} s={3.5} delay={0.6} />
          </>
        )}

        {/* ══════════ ③ 하단: 손이 폴라로이드 사진을 "들어올린다" ══════════ */}
        <motion.g
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
        >
          {/* 손 — 손바닥(타원) + 손가락 캡슐 + 엄지 + accent 소매 */}
          {/* 소매(accent) */}
          <path d="M176,512 L264,512 L272,580 L168,580 Z" fill={ACCENT} />
          <path d="M176,512 L264,512 L266,524 L174,524 Z" fill="#005fd1" opacity="0.55" />
          {/* 손바닥 */}
          <ellipse cx="220" cy="486" rx="52" ry="30" fill={SKIN_LINE} />
          <ellipse cx="220" cy="484" rx="50" ry="28" fill={SKIN} />
          {/* 엄지(왼쪽으로 벌림) */}
          <line x1="176" y1="486" x2="158" y2="460" stroke={SKIN_LINE} strokeWidth="19" strokeLinecap="round" />
          <line x1="176" y1="486" x2="158" y2="460" stroke={SKIN} strokeWidth="16" strokeLinecap="round" />
          {/* 네 손가락(살짝 부채꼴로 사진을 받침) */}
          <Finger x={192} y1={470} y2={432} />
          <Finger x={210} y1={466} y2={424} />
          <Finger x={228} y1={466} y2={426} />
          <Finger x={246} y1={470} y2={436} />

          {/* 폴라로이드 사진 — 손끝에서 살짝 떠올라(톡 던진 순간) 기울어짐 */}
          <g transform="translate(0 -24) rotate(-7 218 388)">
            <rect x="170" y="330" width="104" height="120" fill={PAPER} stroke="#e0e0e3" strokeWidth="1.5" />
            {/* 사진 그림자 */}
            <rect x="173" y="450" width="98" height="4" fill="#000" opacity="0.05" />
            {/* 사진 이미지(매장 한 컷 — 심플 풍경) */}
            <rect x="178" y="338" width="88" height="80" fill="url(#s1-photo)" />
            {/* 해 */}
            <circle cx="248" cy="356" r="8" fill="#fff" opacity="0.85" />
            {/* 매장 실루엣 */}
            <path d="M178,418 L178,392 L200,378 L222,392 L222,418 Z" fill="#c4d2e6" />
            <path d="M222,418 L222,398 L244,398 L244,418 Z" fill="#b7c8e0" />
            {/* 차양(accent 포인트 1곳) */}
            <path d="M178,392 L200,378 L222,392 Z" fill={ACCENT} opacity="0.9" />
            {/* 캡션 여백 라인 */}
            <rect x="182" y="428" width="52" height="6" fill={SKEL} />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
