'use client';

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
  return (
    <section className="w-full bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5">
        {/* ── 섹션 헤드 ── */}
        <div className="mx-auto max-w-[640px] text-center">
          <span
            className="mb-5 inline-block text-xs font-medium tracking-[0.18em] text-text-muted"
            style={{ fontFamily: 'var(--font-en)' }}
          >
            THE REAL BARRIER
          </span>
          <h2
            className="text-[clamp(1.7rem,5.2vw,2.7rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
            style={KR}
          >
            <span className="text-text-muted">어려운 건 마케팅이 아닙니다</span>
            <br />
            <span className="text-text-primary">복잡한 </span>
            <span className="text-text-primary">시작</span>
            <span className="text-text-primary">입니다</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[440px] text-[15px] font-medium leading-[1.5] text-text-body [text-wrap:balance]" style={KR}>
            광고 계정·전환 추적·채널 연결·인증·용어·정산까지
            <br />첫 광고 하나를 시작하기 전에 이 많은 것을 직접 연결해야 했습니다.
          </p>
        </div>

        {/* ── 얽힌 연결망 다이어그램 ── */}
        <div
          className="relative mx-auto mt-12 w-full max-w-[600px]"
          style={{ aspectRatio: `${VW} / ${VH}` }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.05) 1px, transparent 1px)',
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
              <radialGradient id="s2c1-nodeFill" cx="0.5" cy="0.32" r="0.8">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#e6e9ee" />
              </radialGradient>
              {/* 중심→노드: 중심에서 옅게 시작해 노드 쪽에서 진해지는 실 */}
              <radialGradient
                id="s2c1-spoke"
                gradientUnits="userSpaceOnUse"
                cx={C.x}
                cy={C.y}
                r={250}
                fx={C.x}
                fy={C.y}
              >
                <stop offset="0" stopColor="#aeb4bd" stopOpacity="0.5" />
                <stop offset="1" stopColor="#aeb4bd" stopOpacity="1" />
              </radialGradient>
              {/* 얽힘선: 양끝이 흐려지는 실 느낌 */}
              <linearGradient id="s2c1-tangle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#b6bcc5" stopOpacity="0.35" />
                <stop offset="0.5" stopColor="#b6bcc5" stopOpacity="1" />
                <stop offset="1" stopColor="#b6bcc5" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="s2c1-accent" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0070f3" stopOpacity="0.3" />
                <stop offset="0.5" stopColor="#0070f3" stopOpacity="0.9" />
                <stop offset="1" stopColor="#0070f3" stopOpacity="0.3" />
              </linearGradient>
              <filter id="s2c1-nodeShadow" x="-90%" y="-90%" width="280%" height="280%">
                <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.09" />
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.07" />
              </filter>
              <filter id="s2c1-hubShadow" x="-100%" y="-100%" width="300%" height="300%">
                <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.1" />
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* ① 얽힘선 (노드끼리 교차) — 가장 아래 레이어 */}
            {TANGLES.map((t, i) => {
              const a = NODES[t.a];
              const b = NODES[t.b];
              return (
                <path
                  key={`t${i}`}
                  d={curve(a.x, a.y, b.x, b.y, t.bend)}
                  stroke={t.accent ? 'url(#s2c1-accent)' : 'url(#s2c1-tangle)'}
                  strokeWidth={t.accent ? 1.5 : 1.2}
                  strokeDasharray={i % 3 === 1 ? '4 5' : undefined}
                />
              );
            })}

            {/* ② 중심 → 각 노드 방사 실 (한 가닥만 accent) */}
            {NODES.map((n, i) => (
              <line
                key={`s${i}`}
                x1={C.x}
                y1={C.y}
                x2={n.x}
                y2={n.y}
                stroke={i === 4 ? 'url(#s2c1-accent)' : 'url(#s2c1-spoke)'}
                strokeWidth={i === 4 ? 1.6 : 1.3}
              />
            ))}

            {/* ③ 주변 노드 (흰 원 + hairline + 미세 그림자 + 라벨) */}
            {NODES.map((n, i) => {
              const { lx, ly, anchor } = labelPos(n);
              return (
                <g key={`n${i}`}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={9}
                    fill="url(#s2c1-nodeFill)"
                    stroke="#d3d7de"
                    strokeWidth={1}
                    filter="url(#s2c1-nodeShadow)"
                  />
                  <circle cx={n.x} cy={n.y} r={3} fill="#9aa1ac" />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    style={KR}
                    fontSize={15}
                    fontWeight={500}
                    fill="#3f4753"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* ④ 중심 = 내 가게(시작점) — 유일한 강조 */}
            <circle cx={C.x} cy={C.y} r={54} fill="#ffffff" filter="url(#s2c1-hubShadow)" />
            <circle cx={C.x} cy={C.y} r={54} fill="none" stroke="rgba(0,112,243,0.18)" strokeWidth={1.5} />
            <circle cx={C.x} cy={C.y} r={40} fill="rgba(0,112,243,0.06)" />
            <text
              x={C.x}
              y={C.y + 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={46}
              fontWeight={700}
              fill="#0070f3"
              style={{ fontFamily: 'var(--font-en)' }}
            >
              ?
            </text>
          </svg>
        </div>

        {/* ── 캡션 ── */}
        <p className="mx-auto mt-10 max-w-[460px] text-center text-[14px] font-medium leading-[1.5] text-text-weak [text-wrap:balance]" style={KR}>
          시작하기 위해 이 모든 것을 직접 연결해야 했다면, 마케팅이 어렵게 느껴지는 것도 당연했습니다.
        </p>
      </div>
    </section>
  );
}
