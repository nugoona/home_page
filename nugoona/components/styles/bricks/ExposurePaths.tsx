'use client';

/**
 * ExposurePaths — 콘텐츠 카드 목업 A안 "여러 길, 한 도착지"
 * 컨셉: 블로그·플레이스·인스타 세 채널에서 출발한 손님(작은 사람 실루엣)이
 *       각기 다른 직각 꺾은선 길을 따라 흐르지만, 모두 "내 가게" 한 곳에 도착한다.
 *       도착 지점(가게 입구)이 그린으로 점등 — "검색으로 손님이 내 가게를 발견한다"를
 *       순위·1위 개념 없이 시각화. ⛔ 짝퉁 검색 UI·그린틴트 배경·회색 스켈레톤 없음.
 *
 * 시각문법: components/content/NewsFlowGraphic.tsx의 직각 elbow path +
 *   defs/mpath animateMotion 문법을 계승(같은 리포 관례). 다만 대상은 데이터 노드가 아니라
 *   "사람"과 "가게" — 원형 머리(예외 허용) + 라벨로 차갑지 않게.
 * 톤: 화이트 모노크롬(라인·라벨은 회색) + 그린(#2fd46b)은 도착 지점의 점·점등에만.
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const GREEN = '#2fd46b';
const LINE = '#d9d9d9';   // 길(뼈대) — 흐리게
const PERSON = '#8a8a8a'; // 손님 실루엣
const RING = '#bdbdbd';   // 출발점 마커
const SHOP_STROKE = '#333333';
const LABEL = '#666666';

type Lane = {
  id: string;
  label: string;
  d: string;
  dur: number;   // 손님 한 명이 도착하는 데 걸리는 시간(루프 주기)
  begin: number; // 시작 지연(채널마다 다른 손님이 다른 시점에 출발하는 느낌)
  labelX: number;
  labelY: number;
  markerX: number;
  markerY: number;
};

/* ── 좌표계: 3개 행(블로그/플레이스/인스타) → 직각 꺾은선 → 한 지점(462,116)에서 합류 ── */
const ROW_BLOG = 44;
const ROW_PLACE = 116;
const ROW_INSTA = 188;
const ORIGIN_X = 118;
const TURN_X = 300;
const MERGE_X = 460;
const MERGE_Y = 116;

const LANES: Lane[] = [
  {
    id: 'ep-blog',
    label: '블로그',
    d: `M${ORIGIN_X},${ROW_BLOG} H${TURN_X} V${MERGE_Y} H${MERGE_X}`,
    dur: 3.6,
    begin: 0,
    labelX: 8, labelY: ROW_BLOG + 4,
    markerX: ORIGIN_X, markerY: ROW_BLOG,
  },
  {
    id: 'ep-place',
    label: '플레이스',
    d: `M${ORIGIN_X},${ROW_PLACE} H${MERGE_X}`,
    dur: 2.8,
    begin: 0.6,
    labelX: 8, labelY: ROW_PLACE + 4,
    markerX: ORIGIN_X, markerY: ROW_PLACE,
  },
  {
    id: 'ep-insta',
    label: '인스타',
    d: `M${ORIGIN_X},${ROW_INSTA} H${TURN_X} V${MERGE_Y} H${MERGE_X}`,
    dur: 4.0,
    begin: 1.1,
    labelX: 8, labelY: ROW_INSTA + 4,
    markerX: ORIGIN_X, markerY: ROW_INSTA,
  },
];

/* 진입 시 그려지는 길(뼈대) */
function DrawLine({ d, inView, delay }: { d: string; inView: boolean; delay: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={LINE}
      strokeWidth="1.4"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={inView ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 0.75, ease: EASE, delay }}
    />
  );
}

/* 손님 — 원형 머리 + 직선형 몸(사다리꼴). 길을 따라 흐르다 도착점에서 사라짐(반복 루프). */
function Walker({ laneId, dur, begin }: { laneId: string; dur: number; begin: number }) {
  return (
    <g fill={PERSON}>
      <circle cy="-5.5" r="2.3" />
      <path d="M-3,-1.5 L3,-1.5 L2.2,6.5 L-2.2,6.5 Z" />
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite">
        <mpath href={`#${laneId}`} />
      </animateMotion>
    </g>
  );
}

/* 도착 지점 — 손님이 닿을 때마다(채널마다 다른 주기) 그린 링이 한 번씩 번짐 */
function ArrivalBurst({ dur, begin }: { dur: number; begin: number }) {
  return (
    <circle cx={MERGE_X + 2} cy={MERGE_Y} r="3" fill="none" stroke={GREEN} strokeWidth="1.2" opacity="0">
      <animate attributeName="r" values="3;22" dur={`${dur}s`} begin={`${begin + dur * 0.82}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.55;0" dur={`${dur}s`} begin={`${begin + dur * 0.82}s`} repeatCount="indefinite" />
    </circle>
  );
}

/* 내 가게 — 지붕(삼각) + 몸체(사각) + 문(사각). 전부 직선. */
function ShopIcon({ inView }: { inView: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
      style={{ transformOrigin: '508px 116px' }}
    >
      {/* 지붕(캐노피) */}
      <polygon points="452,100 508,64 564,100" fill="#fff" stroke={SHOP_STROKE} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
      {/* 몸체 */}
      <rect x="460" y="100" width="96" height="62" fill="#fff" stroke={SHOP_STROKE} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
      {/* 문 */}
      <rect x="494" y="128" width="28" height="34" fill="#fff" stroke={SHOP_STROKE} strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      {/* 입구 점등 — 항상 켜져 있는 작은 그린 점(발견됨) */}
      <motion.circle
        cx={MERGE_X + 2} cy={MERGE_Y} r="3.2" fill={GREEN}
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: EASE, delay: 1.15 }}
      />
    </motion.g>
  );
}

export default function ExposurePaths() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center px-3 max-md:px-1.5">
      <svg
        viewBox="0 0 640 232"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          {LANES.map((lane) => (
            <path key={lane.id} id={lane.id} d={lane.d} />
          ))}
        </defs>

        {/* 길(뼈대) 드로잉 */}
        {LANES.map((lane, i) => (
          <DrawLine key={lane.id} d={lane.d} inView={inView} delay={0.1 + i * 0.1} />
        ))}

        {/* 출발점 마커 + 채널 라벨 */}
        {LANES.map((lane, i) => (
          <motion.g
            key={`origin-${lane.id}`}
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
          >
            <circle cx={lane.markerX} cy={lane.markerY} r="4" fill="#fff" stroke={RING} strokeWidth="1.3" />
            <text x={lane.labelX} y={lane.labelY} fontSize="12" fontWeight="600" fill={LABEL}>
              {lane.label}
            </text>
          </motion.g>
        ))}

        {/* 도착 시 번지는 그린 링(채널마다 다른 주기 — 서로 다른 손님이 각자 도착) */}
        {inView && LANES.map((lane) => (
          <ArrivalBurst key={`burst-${lane.id}`} dur={lane.dur} begin={lane.begin} />
        ))}

        {/* 내 가게 */}
        <ShopIcon inView={inView} />

        {/* 손님(원형 머리 + 몸) — 길을 따라 흐름 */}
        {inView && LANES.map((lane) => (
          <Walker key={`walker-${lane.id}`} laneId={lane.id} dur={lane.dur} begin={lane.begin} />
        ))}

        {/* 도착지 라벨 */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
        >
          <circle cx="480" cy="190" r="3" fill={GREEN} />
          <text x="490" y="194" fontSize="13" fontWeight="700" fill="#171717">내 가게</text>
        </motion.g>
      </svg>
    </div>
  );
}
