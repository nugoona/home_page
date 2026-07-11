'use client';

/* ═══════════════════════════════════════════════════════════════
   목업 시안 B — "모여드는 손님" (콘텐츠 카드용, /lab 3안 경쟁 중 B안)
   전달 메시지: "손님이 검색하면 내 가게를 만난다"(순위·1위·상단 개념 없음).
   흩어져 있던 손님들(작은 사람 실루엣)이 각자의 경로를 그리며 오른쪽의
   '내 가게'로 모여들고, 도착할수록 가게가 그린으로 환하게 점등한다.
   '검색'의 맥락은 좌상단의 옅은 돋보기 글리프 + "검색" 라벨로만 은은히 암시
   (짝퉁 검색창 없음). 차가운 IT 도식이 아니라 사람이 걸어 들어오는
   곡선 경로로 따뜻한 장면을 만든다.

   ⛔ 금지 게이트 준수: 순위/1위/노출/상위/상단 텍스트 없음 · 짝퉁 실물 UI 없음 ·
      파스텔·그린틴트 배경·회색 스켈레톤 없음 · Vercel/Linear 미니멀 이식 없음.
   톤: 직각(사람 머리·도트·펄스만 원형 예외) · 화이트 모노크롬 · 그린(#2fd46b) 포인트만.
   ═══════════════════════════════════════════════════════════════ */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const GREEN = '#2fd46b';
const GUIDE = '#e4e4e4';       // 경로 안내선(매우 옅음)
const FIGURE = '#a3a3a3';      // 손님 실루엣 기본색(이동 중)
const STORE_LINE = '#bdbdbd';  // 가게 기본 아웃라인(점등 전)
const WEAK = '#999999';
const BODY_TXT = '#333333';

/* 가게 좌표(오른쪽 배치) — entry가 도착점, 손님 경로가 여기로 수렴 */
const STORE_CX = 374;
const ENTRY: [number, number] = [340, 107];

/* 손님 4명 — 시작점 + 자연스러운 곡선 경로(quadratic bezier)로 가게 입구까지 수렴 */
const CUSTOMERS = [
  { path: 'M26,28 Q210,16 340,107' },
  { path: 'M26,178 Q210,190 340,107' },
  { path: 'M128,14 Q250,4 340,107' },
  { path: 'M128,192 Q250,198 340,107' },
] as const;

/* 타이밍 — 경로선이 그려지고(draw) 절반쯤 지날 때 손님이 걷기 시작해 도착한다 */
const LINE_DELAY = [0.15, 0.47, 0.79, 1.11] as const;
const LINE_DUR = 0.55;
const CUST_BEGIN = LINE_DELAY.map((d) => d + 0.28); // [0.43, 0.75, 1.07, 1.39]
const CUST_DUR = 0.85;
const ARRIVAL = CUST_BEGIN.map((b) => b + CUST_DUR); // [1.28, 1.60, 1.92, 2.24]

const GLOW_DUR = 2.6;
const GLOW_TIMES = ARRIVAL.map((a) => a / GLOW_DUR); // [0.492, 0.615, 0.738, 0.862]
const LAST_ARRIVAL = ARRIVAL[ARRIVAL.length - 1];

/* 사람 실루엣 — 머리(원, 예외 허용) + 몸통(직각 사각형). animateMotion으로 경로를 걷는다.
   도착 직전 그린으로 물들며 가게 안으로 사라진다(opacity → 0). */
function Customer({ id, begin }: { id: number; begin: number }) {
  const dur = `${CUST_DUR}s`;
  const fillVals = `${FIGURE};${FIGURE};${GREEN}`;
  return (
    <g opacity={0}>
      <animateMotion dur={dur} begin={`${begin}s`} fill="freeze" repeatCount="1">
        <mpath href={`#cg-path-${id}`} />
      </animateMotion>
      <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.82;1" dur={dur} begin={`${begin}s`} fill="freeze" />
      <circle cx={0} cy={-3} r="2.6" fill={FIGURE}>
        <animate attributeName="fill" values={fillVals} keyTimes="0;0.78;1" dur={dur} begin={`${begin}s`} fill="freeze" />
      </circle>
      <rect x={-3.2} y={0.4} width="6.4" height="7.6" fill={FIGURE}>
        <animate attributeName="fill" values={fillVals} keyTimes="0;0.78;1" dur={dur} begin={`${begin}s`} fill="freeze" />
      </rect>
    </g>
  );
}

/* 도착 순간 — 가게 입구에서 한 번 퍼지는 그린 링 */
function ArrivalPing({ delay, inView }: { delay: number; inView: boolean }) {
  return (
    <motion.circle
      cx={ENTRY[0]}
      cy={ENTRY[1]}
      r="4"
      fill="none"
      stroke={GREEN}
      strokeWidth="1.4"
      vectorEffect="non-scaling-stroke"
      initial={{ scale: 0.6, opacity: 0.6 }}
      animate={inView ? { scale: 3.2, opacity: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
      style={{ transformOrigin: `${ENTRY[0]}px ${ENTRY[1]}px` }}
    />
  );
}

function StoreGraphic({ inView }: { inView: boolean }) {
  return (
    <g>
      {/* 처마/지붕선 — 직각 규칙은 모서리 둥글기 금지이지 각진 도형 자체는 허용(HeroB 화살표와 동일 문법) */}
      <motion.path
        d="M328,70 L374,36 L420,70"
        fill="none"
        stroke={STORE_LINE}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
      />

      {/* 간판 — "내 가게". 마지막 손님 도착 시 흰→그린 전환(점등의 정점) */}
      <motion.rect
        x={354} y={12} width={40} height={24}
        initial={{ fill: '#ffffff', stroke: STORE_LINE, opacity: 0 }}
        animate={inView ? { fill: GREEN, stroke: GREEN, opacity: 1 } : {}}
        transition={{
          opacity: { duration: 0.4, ease: EASE, delay: 0.1 },
          fill: { duration: 0.4, ease: EASE, delay: LAST_ARRIVAL },
          stroke: { duration: 0.4, ease: EASE, delay: LAST_ARRIVAL },
        }}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
      <motion.text
        x={374} y={27} textAnchor="middle" fontSize="9" fontWeight={700}
        initial={{ fill: BODY_TXT, opacity: 0 }}
        animate={inView ? { fill: '#ffffff', opacity: 1 } : {}}
        transition={{
          opacity: { duration: 0.4, ease: EASE, delay: 0.15 },
          fill: { duration: 0.3, ease: EASE, delay: LAST_ARRIVAL + 0.1 },
        }}
      >
        내 가게
      </motion.text>

      {/* 몸체 — 뉴트럴 스켈레톤(항상 존재) 위로 그린 오버레이가 단계적으로 차오른다 */}
      <motion.rect
        x={340} y={70} width={68} height={74}
        fill="none" stroke={STORE_LINE} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
      />
      <motion.rect
        x={340} y={70} width={68} height={74}
        fill={GREEN}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 0.25, 0.5, 0.75, 1] } : {}}
        transition={{ duration: GLOW_DUR, times: [0, ...GLOW_TIMES], ease: 'linear' }}
      />
      {/* 문 — 카드 배경색으로 오려낸 듯 표시 */}
      <rect x={364} y={112} width={20} height={32} fill="var(--color-bg-alt,#f7f7f7)" stroke={STORE_LINE} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />

      {/* 완전 점등 후 은은히 살아있는 반복 pulse */}
      {inView && (
        <motion.circle
          cx={STORE_CX} cy={107} r="12" fill="none" stroke={GREEN} strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 3.6], opacity: [0.35, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: LAST_ARRIVAL + 0.4 }}
          style={{ transformOrigin: `${STORE_CX}px 107px` }}
        />
      )}
    </g>
  );
}

/* 좌상단 — 돋보기 글리프 + "검색" 라벨(짝퉁 검색창 없이 맥락만 은은히 암시) */
function SearchGlyph({ inView }: { inView: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
    >
      <circle cx={19} cy={19} r="5.5" fill="none" stroke={WEAK} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
      <line x1={23} y1={23} x2={28} y2={28} stroke={WEAK} strokeWidth="1.3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <text x={36} y={23} fontSize="10" fontWeight={600} fill={WEAK}>검색</text>
    </motion.g>
  );
}

export default function ExposureGather() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center px-2">
      <svg
        viewBox="0 0 460 206"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', maxHeight: '100%', display: 'block' }}
        aria-hidden
      >
        <defs>
          {CUSTOMERS.map((c, i) => (
            <path key={i} id={`cg-path-${i}`} d={c.path} />
          ))}
        </defs>

        <SearchGlyph inView={inView} />

        {/* 경로 안내선 — 옅게 그려지며 손님이 걸어올 길을 예고 */}
        {CUSTOMERS.map((c, i) => (
          <motion.path
            key={i}
            d={c.path}
            fill="none"
            stroke={GUIDE}
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: LINE_DUR, ease: EASE, delay: LINE_DELAY[i] }}
          />
        ))}

        <StoreGraphic inView={inView} />

        {/* 손님 실루엣 — 경로를 걸어 가게로 모여든다 */}
        {inView && CUSTOMERS.map((_, i) => (
          <Customer key={i} id={i} begin={CUST_BEGIN[i]} />
        ))}

        {/* 도착 순간 그린 링 */}
        {ARRIVAL.map((a, i) => (
          <ArrivalPing key={i} delay={a} inView={inView} />
        ))}
      </svg>
    </div>
  );
}
