'use client';

import { motion, useReducedMotion } from 'framer-motion';
import OccupancyGrid, { type GridArea } from '@/components/layout/OccupancyGrid';

/**
 * 홈 S2 — 시안 1 "얽힌 연결망"
 * 메시지: "어려운 건 마케팅이 아닙니다. 복잡한 시작입니다."
 *   → 진짜 장벽은 마케팅 자체가 아니라 계정·픽셀·API·인증·용어 같은 '시작 단계의 복잡함'.
 *
 * 기법 재조립(소스 분석 → 변형):
 *  - Clone02 방사형 API 허브: 중심 HUB→노드 <line> + 끝점 도트 → 여기서는 노드끼리도 교차선을 얹어 '과밀·얽힘'으로 변형.
 *  - Clone05/06 궤도: linearGradient stroke로 선 끝 opacity fade → 얽힌 실이 흐려지는 느낌으로 차용.
 *  - 노드 = 흰 원 + hairline + feDropShadow(미세) → Vercel 칩 미감을 라이트 모노크롬으로.
 *  - 색 절제: 회색 실 위에 accent(#0070f3) 단 두 가닥만. '정돈된 무질서'.
 * 전부 SVG(preserveAspectRatio meet)라 데스크톱·모바일 동일 비율로 스케일 → 360폭에서도 안 깨짐.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;

/* ── Grid Occupancy 칸 분할(2026-07-14 재구성 — 사장님 "빈칸 지양" §8.16-A6).
   PC = Vercel 2열 문법: 좌 헤딩 레일(5칸: eyebrow+헤딩+캡션, 좌측 정렬) + 우 다이어그램(7칸 통칸).
   blank 없음 — 칸 전부 콘텐츠. 모바일 = 풀폭 행 분할(히어로 원작 방식과 세트). ── */
/* Vercel 참조 스샷(2026-07-15): 좌 레일(✦+헤딩) + 우 칸 = 상단 리드문 행 + 아래 다이어그램 */
const D_AREAS: GridArea[] = [
  { key: 'head', c: [1, 6], r: [1, 8], className: 'flex items-center' },
  { key: 'lead', c: [6, 13], r: [1, 3], className: 'flex items-center' },
  { key: 'diagram', c: [6, 13], r: [3, 8] },
];
/* 모바일 8열 — ★풀폭 행 분할(좌우 빈 열로 콘텐츠 폭을 깎으면 "디자인 망가짐" 사장님 반려 실증).
   모바일 원칙: 칸 = 가로 풀폭, 세로 행 리듬만. 하단 빈 행 없음 */
const M_AREAS: GridArea[] = [
  { key: 'b-top', c: [1, 9], r: [1, 2], blank: true },
  { key: 'head', c: [1, 9], r: [2, 6] },      // 풀폭 4행(서브 삭제 후 실측 축소 — 빈칸 지양 §8.16-A6)
  { key: 'diagram', c: [1, 9], r: [6, 13] },  // 풀폭 7행(680:560 meet)
  { key: 'caption', c: [1, 9], r: [13, 15] }, // 풀폭 2행
];

/* ── 좌표계 (viewBox 680×560) ───────────────────────── */
const VW = 680;
const VH = 560;
const C = { x: 340, y: 286 } as const; // 중심 = 내 가게(시작점)

type Node = { label: string; x: number; y: number };
/** 시작하려면 엮어야 하는 것들 — 어지럽게(불규칙 반경·각도) 배치 */
const NODES: readonly Node[] = [
  { label: '광고 계정', x: 156, y: 96 },
  { label: '전환 추적', x: 452, y: 74 },
  { label: '계정 연결', x: 560, y: 206 },
  { label: '사업자 인증', x: 536, y: 392 },
  { label: '예산·입찰', x: 392, y: 480 },
  { label: '정산', x: 182, y: 470 },
  { label: '광고 용어', x: 98, y: 318 },
  { label: '채널 연결', x: 120, y: 174 },
];

/** 노드끼리 얽는 선(교차 유발 쌍) + 굽힘·강조 여부 */
const TANGLES: readonly { a: number; b: number; bend: number; accent?: boolean }[] = [
  { a: 0, b: 3, bend: 70 },
  { a: 7, b: 4, bend: -80 },
  { a: 1, b: 5, bend: 90, accent: true },
  { a: 2, b: 6, bend: -66 },
  { a: 2, b: 4, bend: 40 },
  { a: 0, b: 2, bend: -30 },
  { a: 5, b: 3, bend: 34 },
];

/** 두 점을 잇는 굽은 실(Q 커브) — 중점에서 수직으로 bend만큼 휘어 교차를 만든다 */
function curve(ax: number, ay: number, bx: number, by: number, bend: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return `M${ax} ${ay} Q${mx + nx * bend} ${my + ny * bend} ${bx} ${by}`;
}

/** 라벨을 노드 바깥(중심 반대 방향)으로 밀어 원과 겹치지 않게 */
function labelPos(n: Node) {
  const dx = n.x - C.x;
  const dy = n.y - C.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = 30;
  const lx = n.x + (dx / len) * off;
  const ly = n.y + (dy / len) * off + 5;
  const anchor = dx / len > 0.32 ? 'start' : dx / len < -0.32 ? 'end' : 'middle';
  return { lx, ly, anchor } as const;
}

export default function S2Concept1() {
  const reduce = !!useReducedMotion();

  /* PC = 좌 헤딩 레일(Vercel 2열 문법): ✦ eyebrow + 굵은 검정 헤딩 + 캡션. 좌측 정렬.
     Vercel감 처방(2026-07-15): 헤딩 회색 줄 폐지(무게 분산 원인) → 전체 검정 bold, ✦ 스파클 하드웨어 */
  const headRail = (
    <div className="px-8 py-8 lg:px-12">
      <span className="mb-6 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
          <path d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z" fill="#333333" />
          <path d="M7.2 3.4c.32 1.5 1.14 2.34 2.65 2.66-1.51.32-2.33 1.15-2.65 2.66-.32-1.51-1.14-2.34-2.65-2.66 1.51-.32 2.33-1.16 2.65-2.66Z" fill="#333333" />
        </svg>
        <span className="text-[14px] font-medium text-[#555555]" style={{ fontFamily: 'var(--font-en)' }}>
          The Real Barrier
        </span>
      </span>
      <h2 className="text-[clamp(1.8rem,3.4vw,2.75rem)] font-bold leading-[1.28] tracking-[-0.04em] text-text-primary" style={KR}>
        어려운 건 마케팅이 아닙니다
        <br />
        복잡한 시작입니다
      </h2>
    </div>
  );

  /* 우 칸 상단 리드문(Vercel "AI Gateway. Switch between..." 문법 — 캡션 승격, 헤딩급 크기) */
  const lead = (
    <p className="w-full px-8 text-left text-[clamp(17px,1.7vw,22px)] font-medium leading-[1.55] tracking-[-0.02em] text-[#4f4f4f] lg:px-12" style={KR}>
      <span className="font-bold text-text-primary">시작을 어렵게 만든 건</span> 이 복잡한 연결이었습니다
    </p>
  );

  const head = (
    <div className="max-w-[640px] px-5 text-center">
          <span
            className="mb-5 inline-block text-xs font-medium tracking-[0.18em] text-text-muted"
            style={{ fontFamily: 'var(--font-en)' }}
          >
            THE REAL BARRIER
          </span>
          <h2
            className="text-[clamp(1.7rem,5.2vw,2.7rem)] font-semibold leading-[1.3] tracking-[-0.04em]"
            style={KR}
          >
            <span className="text-text-muted">어려운 건 마케팅이 아닙니다</span>
            <br />
            <span className="text-text-primary">복잡한 </span>
            <span className="text-text-primary">시작</span>
            <span className="text-text-primary">입니다</span>
          </h2>
      {/* 서브 삭제(2026-07-14 확정) — 다이어그램 노드 8개가 같은 열거를 시각으로 수행 */}
    </div>
  );

  /* 다이어그램 칸(6×5셀 ≈ viewBox 680:560) — 칸에 꽉 채움, SVG meet가 비율 유지.
     ⚠️ uid: 모바일/데스크톱 그리드에 중복 렌더되므로 SVG defs id가 겹치면
     display:none 쪽 gradient가 참조돼 선이 사라짐(실증) — id에 uid 필수. */
  const diagram = (uid: string) => <TangleDiagram uid={uid} />;

  /* 캡션 = 텍스트 감량 확정 문구(2026-07-14 사장님, 1줄) */
  const caption = (
    <p className="max-w-[480px] px-5 text-center text-[15px] font-medium leading-[1.5] text-text-body" style={KR}>
      시작을 어렵게 만든 건 이 복잡한 연결이었습니다
    </p>
  );

  /* uid 분리 — 모바일/데스크톱 중복 렌더 시 SVG defs id 충돌 방지 */
  const renderD = (key: string) => (key === 'head' ? headRail : key === 'lead' ? lead : diagram('s2d'));
  const renderM = (key: string) => (key === 'head' ? head : key === 'diagram' ? diagram('s2m') : caption);

  return (
    <section className="w-full bg-bg">
      <OccupancyGrid cols={8} rows={14} areas={M_AREAS} mobile render={renderM} />
      <OccupancyGrid cols={12} rows={7} areas={D_AREAS} mobile={false} render={renderD} />
    </section>
  );
}

/** 얽힌 연결망 다이어그램 — /ads 2번(공감) 섹션에서 재사용(2026-07-18 사장님 "홈에서 버린 목업 여기 쓰자").
    홈 원작(S2Concept1) 렌더는 불변 — 다이어그램만 export 분리 */
export function TangleDiagram({ uid }: { uid: string }) {
  const reduce = !!useReducedMotion();
  return (
    <div className="relative h-full w-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.07) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              WebkitMaskImage: 'radial-gradient(ellipse 78% 78% at 50% 50%, #000 55%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 78% 78% at 50% 50%, #000 55%, transparent 100%)',
            }}
          />
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            aria-hidden
          >
            <defs>
              {/* 노드 원 입체 채움 — 위 밝고 아래 진하게 */}
              <radialGradient id={`${uid}-nodeFill`} cx="0.5" cy="0.32" r="0.8">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#e6e9ee" />
              </radialGradient>
              {/* 중심→노드: 중심에서 옅게 시작해 노드 쪽에서 진해지는 실 */}
              <radialGradient
                id={`${uid}-spoke`}
                gradientUnits="userSpaceOnUse"
                cx={C.x}
                cy={C.y}
                r={250}
                fx={C.x}
                fy={C.y}
              >
                <stop offset="0" stopColor="#171717" stopOpacity="0.45" />
                <stop offset="1" stopColor="#171717" stopOpacity="0.95" />
              </radialGradient>
              {/* 얽힘선: hairline 완전 검정(사장님 2026-07-15 "매우 얇게 + 완전 검정") — 양끝만 살짝 fade */}
              <linearGradient id={`${uid}-tangle`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#171717" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#171717" stopOpacity="1" />
                <stop offset="1" stopColor="#171717" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id={`${uid}-accent`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0070f3" stopOpacity="0.45" />
                <stop offset="0.5" stopColor="#0070f3" stopOpacity="1" />
                <stop offset="1" stopColor="#0070f3" stopOpacity="0.45" />
              </linearGradient>
              <filter id={`${uid}-nodeShadow`} x="-90%" y="-90%" width="280%" height="280%">
                <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.09" />
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.07" />
              </filter>
              <filter id={`${uid}-hubShadow`} x="-100%" y="-100%" width="300%" height="300%">
                <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.1" />
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* ① 얽힘선 (노드끼리 교차) — accent 실은 전류처럼 흐르는 점선(살짝, 사장님 2026-07-15) */}
            {TANGLES.map((t, i) => {
              const a = NODES[t.a];
              const b = NODES[t.b];
              const d = curve(a.x, a.y, b.x, b.y, t.bend);
              if (t.accent && !reduce) {
                return (
                  <motion.path
                    key={`t${i}`}
                    d={d}
                    stroke={`url(#${uid}-accent)`}
                    strokeWidth={1.2}
                    strokeDasharray="7 9"
                    animate={{ strokeDashoffset: [0, -64] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                  />
                );
              }
              if (i % 3 === 1 && !reduce) {
                /* 회색 점선 실도 아주 느리게 흐름(추가 애니 — 사장님 2026-07-15) */
                return (
                  <motion.path
                    key={`t${i}`}
                    d={d}
                    stroke={`url(#${uid}-tangle)`}
                    strokeWidth={0.9}
                    strokeDasharray="4 5"
                    animate={{ strokeDashoffset: [0, -36] }}
                    transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
                  />
                );
              }
              return (
                <path
                  key={`t${i}`}
                  d={d}
                  stroke={t.accent ? `url(#${uid}-accent)` : `url(#${uid}-tangle)`}
                  strokeWidth={t.accent ? 1.2 : 0.9}
                  strokeDasharray={i % 3 === 1 ? '4 5' : undefined}
                />
              );
            })}

            {/* ② 중심 → 각 노드 방사 실 (한 가닥만 accent — 흐르는 점선) */}
            {NODES.map((n, i) =>
              i === 4 && !reduce ? (
                <motion.line
                  key={`s${i}`}
                  x1={C.x}
                  y1={C.y}
                  x2={n.x}
                  y2={n.y}
                  stroke={`url(#${uid}-accent)`}
                  strokeWidth={1.3}
                  strokeDasharray="7 9"
                  animate={{ strokeDashoffset: [0, -64] }}
                  transition={{ repeat: Infinity, duration: 5.5, ease: 'linear' }}
                />
              ) : (
                <line
                  key={`s${i}`}
                  x1={C.x}
                  y1={C.y}
                  x2={n.x}
                  y2={n.y}
                  stroke={i === 4 ? `url(#${uid}-accent)` : `url(#${uid}-spoke)`}
                  strokeWidth={i === 4 ? 1.3 : 0.9}
                />
              ),
            )}

            {/* ③ 주변 노드 — 각자 다른 위상으로 2~3px 부유(불안정하게 떠 있는 연결들) */}
            {NODES.map((n, i) => {
              const { lx, ly, anchor } = labelPos(n);
              return (
                <motion.g
                  key={`n${i}`}
                  animate={reduce ? undefined : { y: [0, i % 2 === 0 ? -3 : 3, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5 + (i % 4) * 0.9, ease: 'easeInOut', delay: i * 0.35 }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={9}
                    fill={`url(#${uid}-nodeFill)`}
                    stroke="#c3c9d2"
                    strokeWidth={1}
                    filter={`url(#${uid}-nodeShadow)`}
                  />
                  <circle cx={n.x} cy={n.y} r={3} fill="#818a96" />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    style={KR}
                    fontSize={15}
                    fontWeight={500}
                    fill="#333a45"
                  >
                    {n.label}
                  </text>
                </motion.g>
              );
            })}

            {/* ④ 중심 = 내 가게(시작점) — 다크 원 + 흰 가게 아이콘(Vercel 중앙 다크 원 문법.
                구 "?" + 파스텔 블루 배경 폐기 — 사장님 2026-07-15) */}
            <circle cx={C.x} cy={C.y} r={56} fill="none" stroke="#e2e5e9" strokeWidth={1} />
            {/* 중앙 ripple — ⚠항상 렌더(조건부 = reduce-motion 기기 hydration 에러, 2026-07-18 실증) */}
            {(
              <motion.circle
                cx={C.x}
                cy={C.y}
                fill="none"
                stroke="#171717"
                strokeWidth={1}
                initial={{ r: 46, opacity: 0 }}
                animate={reduce ? { opacity: 0 } : { r: [46, 72], opacity: [0.35, 0] }}
                transition={reduce ? undefined : { repeat: Infinity, duration: 3.2, ease: 'easeOut', repeatDelay: 1.2 }}
              />
            )}
            <circle cx={C.x} cy={C.y} r={44} fill="#171717" filter={`url(#${uid}-hubShadow)`} />
            {/* 중앙 = 사장님(lucide 'user') — 주변 노드가 구글·페북·네이버 등 매체 계정·설정이므로,
                그 한가운데서 직접 연결해야 했던 사람(사장님 2026-07-15. 가게 아이콘 반려) */}
            <g transform={`translate(${C.x - 16.8}, ${C.y - 16.8}) scale(1.4)`} stroke="#ffffff" strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </g>
          </svg>
    </div>
  );

}
