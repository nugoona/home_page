'use client';

/* ═══════════════════════════════════════════════════════════════
   ExposureLightup — 콘텐츠 카드 목업 C안 "켜지는 내 가게"
   메시지: "손님이 검색하면 내 가게를 만난다"(발견이지 순위가 아님).
   은유: 흐릿한 가게 11곳(연회색 라인아트, 등수 표기 없음)이 흩어져 있는 가운데,
   손님의 검색(돋보기)이 그 사이를 가로질러 지나가다 '내 가게' 위에서 멈춘다.
   멈추는 순간 내 가게만 그린으로 켜진다 — 창에 불이 들어오는 문자 그대로의
   점등과 "발견됐다"는 은유를 겹친 이중 표현. 다른 가게는 계속 흐린 채로
   남는다(경쟁자 X등 표기 없음 — 그냥 익명의 흐린 가게들).
   톤: 직각 라인아트(가게 몸체) + 원형 예외(돋보기 렌즈 · 발견 펄스 링).
   기법: 프레이머(엔트런스·색전이) + 원작 문법의 SMIL animateMotion(S12 Fork ·
   NewsFlowGraphic MediaNode와 동일 패턴 — 이 저장소에서 이미 검증된 방식).
   ═══════════════════════════════════════════════════════════════ */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const GRAY = '#cccccc';
const GREEN = '#2fd46b';
const TEXT = '#171717';

/* 돋보기 이동 경로 — 가게들 사이를 가로질러 '내 가게' 위에서 멈춘다(직각: 수평 이동) */
const MINE = { cx: 202, cy: 118 };
const PATH_START_X = -26;
const SCAN_DUR = 1.2;
const SCAN_BEGIN = 0.9;
const ARRIVE = SCAN_BEGIN + SCAN_DUR; // 2.1s — 내 가게 점등 시각

/* 흐릿한 가게 11곳 — 등수 없이 그냥 흩어진 익명의 가게들 */
const GRAY_STORES = [
  { cx: 54, cy: 46 },
  { cx: 140, cy: 34 },
  { cx: 230, cy: 46 },
  { cx: 322, cy: 38 },
  { cx: 46, cy: 108 },
  { cx: 134, cy: 92 },
  { cx: 270, cy: 100 },
  { cx: 352, cy: 112 },
  { cx: 70, cy: 176 },
  { cx: 166, cy: 184 },
  { cx: 258, cy: 178 },
];

/* 가게 픽토그램(직각) — 차양 · 몸체 · 창 · 문. 흐린 가게용(정적) */
function StoreGlyph({ cx, cy }: { cx: number; cy: number }) {
  const bw = 30, bh = 22;
  const bx = cx - bw / 2, by = cy - bh / 2;
  return (
    <g>
      <rect x={bx - 2} y={by - 4} width={bw + 4} height={3} fill="none" stroke={GRAY} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={GRAY} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <rect x={bx + 4} y={by + 4} width="9" height="8" fill="none" stroke={GRAY} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <rect x={bx + bw - 11} y={by + bh - 11} width="7" height="11" fill="none" stroke={GRAY} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

/* '내 가게' — 처음엔 회색, ARRIVE 시각에 그린으로 점등(창에 불이 들어옴 + 펄스 + 라벨) */
function MyStoreGlyph({ inView }: { inView: boolean }) {
  const { cx, cy } = MINE;
  const bw = 30, bh = 22;
  const bx = cx - bw / 2, by = cy - bh / 2;
  const strokeAnim = {
    initial: { stroke: GRAY },
    animate: inView ? { stroke: GREEN } : {},
    transition: { duration: 0.35, ease: EASE, delay: ARRIVE },
  };
  return (
    <g>
      <motion.rect x={bx - 2} y={by - 4} width={bw + 4} height={3} fill="none" strokeWidth="1.4" vectorEffect="non-scaling-stroke" {...strokeAnim} />
      <motion.rect x={bx} y={by} width={bw} height={bh} fill="none" strokeWidth="1.4" vectorEffect="non-scaling-stroke" {...strokeAnim} />
      {/* 창 — 불이 들어오는 지점(그린 채움 + 테두리 동시 전이) */}
      <motion.rect
        x={bx + 4} y={by + 4} width="9" height="8" fill={GREEN}
        strokeWidth="1.2" vectorEffect="non-scaling-stroke"
        initial={{ stroke: GRAY, fillOpacity: 0 }}
        animate={inView ? { stroke: GREEN, fillOpacity: 1 } : {}}
        transition={{ duration: 0.3, ease: EASE, delay: ARRIVE }}
      />
      <motion.rect x={bx + bw - 11} y={by + bh - 11} width="7" height="11" fill="none" strokeWidth="1.2" vectorEffect="non-scaling-stroke" {...strokeAnim} />

      {/* 발견 펄스 링(원형 예외) */}
      {inView && (
        <circle cx={cx} cy={cy} r="14" fill="none" stroke={GREEN} strokeWidth="1">
          <animate attributeName="r" values="14;26" dur="1.8s" begin={`${ARRIVE + 0.15}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="1.8s" begin={`${ARRIVE + 0.15}s`} repeatCount="indefinite" />
        </circle>
      )}

      {/* 라벨 — 순위·등수 없이 '내 가게'만 표기 */}
      <motion.text
        x={cx} y={by - 12} textAnchor="middle" fontSize="12" fontWeight="700" fill={TEXT}
        initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: EASE, delay: ARRIVE + 0.25 }}
      >
        내 가게
      </motion.text>
    </g>
  );
}

/* 돋보기 — 가게들 사이를 수평으로 가로질러 '내 가게' 위에서 멈춘다(직각 이동 · 원형 렌즈는 예외) */
function SearchMagnifier({ inView }: { inView: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.2, ease: EASE, delay: SCAN_BEGIN }}
    >
      <g>
        {inView && (
          <animateMotion dur={`${SCAN_DUR}s`} begin={`${SCAN_BEGIN}s`} fill="freeze" repeatCount="1">
            <mpath href="#lightup-scan-path" />
          </animateMotion>
        )}
        <circle r="8" cx="0" cy="0" fill="none" strokeWidth="1.8" vectorEffect="non-scaling-stroke">
          <animate attributeName="stroke" values={`${GRAY};${GREEN}`} calcMode="discrete" dur={`${SCAN_DUR}s`} begin={`${SCAN_BEGIN}s`} fill="freeze" />
        </circle>
        <line x1="5.6" y1="5.6" x2="13" y2="13" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke">
          <animate attributeName="stroke" values={`${GRAY};${GREEN}`} calcMode="discrete" dur={`${SCAN_DUR}s`} begin={`${SCAN_BEGIN}s`} fill="freeze" />
        </line>
      </g>
    </motion.g>
  );
}

export default function ExposureLightup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden
      >
        <defs>
          <path id="lightup-scan-path" d={`M${PATH_START_X},${MINE.cy} H${MINE.cx}`} />
        </defs>

        {GRAY_STORES.map((s, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.035 }}
          >
            <StoreGlyph cx={s.cx} cy={s.cy} />
          </motion.g>
        ))}

        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
        >
          <MyStoreGlyph inView={inView} />
        </motion.g>

        <SearchMagnifier inView={inView} />
      </svg>
    </div>
  );
}
