'use client';

/**
 * 홈 S3 — 시안 B "거의 다 끝난 흐름 → 마지막 하나만 사장님" (개념 그래픽, UI 아님 — §8.14-10)
 * 메시지(home.ts homeV2.ourWay):
 *   head    "어려운 건 앱이 합니다. / 확인은 사장님이 합니다."
 *   body[0] "앱은 준비하고, 설명하고, 다음 일을 알려드립니다."
 *   body[1] "사장님은 마지막 확인만 하시면 됩니다."
 *
 * ▣ 개념 은유 = "이미 다 끝난 흐름"의 비대칭
 *   - 가로 흐름. 앞 노드 3개 = 흰 원 + 1px #ECECEC + 작은 회색 ✓(앱이 이미 완료 = 조용·무채색).
 *   - 맨 끝 노드 하나만 = accent(#0070f3) 채움 + 흰 ✓ = 사장님의 마지막 확인.
 *   회색 완료(다수·조용) vs 파란 ✓(끝 하나)의 비대칭으로
 *   "거의 다 됐고 이 하나만 확인하면 끝 = 쉽다·편하다·안심"을 직관화.
 *
 * ▣ Vercel 소스 재조립(라벨 복붙 아님):
 *   - 커넥터 = Clone01 기법. SVG path + linearGradient stroke, 끝 opacity 0 fade(양끝). 회색(#848484), strokeWidth 유지.
 *     ⛔ 선을 파랗게 물들이지 않는다(절제 §8.14-7).
 *   - 그림자 = Clone08 실측 tight `0 6px 16px rgba(0,0,0,.04)`급. feDropShadow opacity < 0.08·stdDeviation 작게.
 *     ⛔ 퍼지는 그림자(stdDeviation 큰·opacity 0.08+)·후광 glow 금지(사장님 지적).
 *   - 강조 = 그림자 아님. accent 색/얇은 링으로만.
 *   - 노드 = 흰 배경 + 1px solid #ECECEC(§ Vercel 실측). accent 노드만 은은한 세로 그라디언트로 입체.
 *
 * ⛔ 진행바·퍼센트·스텝퍼·버튼·리스트 등 실제 UI로 읽히지 않게 — 추상 노드 흐름(§8.14-10).
 *   노드에 글자·숫자 금지. 의미는 '색·개수·끝단 하나'로만.
 * ✅ 모바일: SVG viewBox 스케일(360 대응). 끝 ✓ 노드 우측 여백 확보(viewBox 600, final cx 520 → 짤림 없음).
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const EN = { fontFamily: 'var(--font-en)' } as const;

/* ── 좌표계 (viewBox 600×200) — 완만한 가로 흐름 ─────────────
 * 완료 3개(회색) + 마지막 1개(accent). 끝 노드는 간격을 넓혀 "이 하나만"을 강조. */
const VW = 600;
const VH = 200;

type Node = { x: number; y: number; r: number };
const R_DONE = 20;
const R_FINAL = 26;

const DONE: readonly Node[] = [
  { x: 74, y: 112, r: R_DONE },
  { x: 214, y: 100, r: R_DONE },
  { x: 354, y: 94, r: R_DONE },
];
const FINAL: Node = { x: 520, y: 100, r: R_FINAL }; // 유일한 accent — 사장님의 마지막 확인
const FLOW: readonly Node[] = [...DONE, FINAL];

/** 인접 두 노드의 '테두리 밖'을 잇는 선분(끝은 노드에 닿기 전 gap) — Clone01 line 스타일 */
function segment(a: Node, b: Node) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const gap = 7;
  return {
    x1: +(a.x + (a.r + gap) * ux).toFixed(2),
    y1: +(a.y + (a.r + gap) * uy).toFixed(2),
    x2: +(b.x - (b.r + gap) * ux).toFixed(2),
    y2: +(b.y - (b.r + gap) * uy).toFixed(2),
  };
}

/** 노드 중심 기준 체크(✓) path — 텍스트 없이 '확인'을 직관화 */
function checkD(cx: number, cy: number, s: number) {
  return `M${cx - s} ${cy + s * 0.06} L${cx - s * 0.22} ${cy + s * 0.72} L${cx + s * 1.02} ${cy - s * 0.7}`;
}

const SEGMENTS = FLOW.slice(0, -1).map((a, i) => segment(a, FLOW[i + 1]));

export default function S3GraphicB() {
  return (
    <section className="w-full bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5">
        {/* ── 섹션 헤드 (home.ts ourWay.head 그대로) ── */}
        <div className="mx-auto max-w-[640px] text-center">
          <span className="mb-5 inline-block text-xs font-medium tracking-[0.18em] text-text-muted" style={EN}>
            OUR WAY
          </span>
          <h2
            className="text-[clamp(1.7rem,5.2vw,2.7rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary [text-wrap:balance]"
            style={KR}
          >
            어려운 건 앱이 합니다.
            <br />
            확인은 사장님이 합니다.
          </h2>
        </div>

        {/* ── 개념 그래픽 패널: #FAFAFA + 도트 30px(별도 레이어·edge mask) ── */}
        <div className="relative mx-auto mt-14 w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#ececec] bg-[#fafafa] px-5 py-9 sm:py-11">
          {/* 배경 도트 (별도 absolute 레이어 + mask 분리 — §8.14-6) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.055) 1px, transparent 1.4px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '15px 12px',
              WebkitMaskImage: 'radial-gradient(ellipse 82% 78% at 50% 50%, #000 45%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 82% 78% at 50% 50%, #000 45%, transparent 100%)',
            }}
          />

          <div className="relative w-full" style={{ aspectRatio: `${VW} / ${VH}` }}>
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VW} ${VH}`}
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              role="img"
              aria-label="앱이 이미 끝낸 세 단계는 조용한 회색 확인 표시로 이어지고, 흐름의 맨 끝 하나만 사장님이 확인하는 파란 체크로 밝게 강조된 그림"
            >
              <defs>
                {/* 커넥터: 끝 opacity 0 fade (Clone01 기법) — segment별 userSpaceOnUse */}
                {SEGMENTS.map((s, i) => (
                  <linearGradient
                    key={`g${i}`}
                    id={`s3b-line-${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                  >
                    <stop offset="0" stopColor="#848484" stopOpacity={0} />
                    <stop offset="0.18" stopColor="#848484" stopOpacity={1} />
                    <stop offset="0.82" stopColor="#848484" stopOpacity={1} />
                    <stop offset="1" stopColor="#848484" stopOpacity={0} />
                  </linearGradient>
                ))}

                {/* 완료 노드 그림자 = tight 다층 (opacity < 0.08 — 퍼짐 금지) */}
                <filter id="s3b-doneShadow" x="-60%" y="-60%" width="220%" height="220%">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.05" />
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.045" />
                </filter>
                {/* accent 노드 그림자 = accent 톤 tight (여전히 opacity < 0.08) */}
                <filter id="s3b-finalShadow" x="-70%" y="-70%" width="240%" height="240%">
                  <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0070f3" floodOpacity="0.07" />
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0070f3" floodOpacity="0.06" />
                </filter>
                {/* accent 노드 채움 = 은은한 세로 그라디언트(위 밝고 아래 진하게) */}
                <linearGradient id="s3b-final" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0" stopColor="#2a8bff" />
                  <stop offset="1" stopColor="#0064da" />
                </linearGradient>
              </defs>

              {/* ① 커넥터 — 노드 뒤 레이어. 회색·또렷(§8.14-2), 파랗게 물들이지 않음 */}
              {SEGMENTS.map((s, i) => (
                <line
                  key={`l${i}`}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  stroke={`url(#s3b-line-${i})`}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              ))}

              {/* ② 완료 노드(회색·조용) — 흰 원 + 1px #ECECEC + 작은 회색 ✓ */}
              {DONE.map((p, i) => (
                <g key={`d${i}`} filter="url(#s3b-doneShadow)">
                  <circle cx={p.x} cy={p.y} r={p.r} fill="#ffffff" stroke="#ececec" strokeWidth={1} />
                  <path
                    d={checkD(p.x, p.y, 5.6)}
                    fill="none"
                    stroke="#9aa1ac"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}

              {/* ③ 마지막 확인 노드(유일한 accent) — accent 채움 + 흰 ✓. 강조는 색/얇은 링, 그림자 아님 */}
              {/* 얇은 accent 포커스 링(crisp, 퍼지는 후광 아님) */}
              <circle cx={FINAL.x} cy={FINAL.y} r={FINAL.r + 9} fill="none" stroke="#0070f3" strokeOpacity="0.16" strokeWidth="1.5" />
              <g filter="url(#s3b-finalShadow)">
                <circle cx={FINAL.x} cy={FINAL.y} r={FINAL.r} fill="url(#s3b-final)" stroke="#0064da" strokeWidth="1" />
                {/* 상단 하이라이트(입체) */}
                <ellipse cx={FINAL.x - 6} cy={FINAL.y - 9} rx={9} ry={5} fill="#ffffff" opacity="0.22" />
                <path
                  d={checkD(FINAL.x, FINAL.y, 9)}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* ── 두 줄 캡션 (home.ts ourWay.body 그대로) ── */}
        <div className="mx-auto mt-14 grid max-w-[680px] gap-x-12 gap-y-8 sm:grid-cols-2">
          {/* 앱 = 준비·설명·알림 (회색 완료 다수 — 그래픽의 회색 노드와 호응) */}
          <div className="flex items-start gap-3">
            <span className="mt-[6px] flex shrink-0 items-center gap-[5px]" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-[7px] w-[7px] rounded-full bg-[#c2c7cf]" />
              ))}
            </span>
            <p className="text-[14.5px] font-medium leading-[1.5] text-text-body [text-wrap:balance]" style={KR}>
              앱은 준비하고, 설명하고, 다음 일을 알려드립니다.
            </p>
          </div>
          {/* 사장님 = 마지막 확인(✓) 하나 (accent — 그래픽의 파란 노드와 호응) */}
          <div className="flex items-start gap-3">
            <span
              className="mt-[3px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(to bottom, #2a8bff, #0064da)',
                boxShadow: '0 2px 5px rgba(0,112,243,0.22)',
              }}
              aria-hidden
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5.2 L4.1 7.3 L8 3" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-[14.5px] font-medium leading-[1.5] text-text-primary [text-wrap:balance]" style={KR}>
              사장님은 마지막 확인만 하시면 됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
