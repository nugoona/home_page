'use client';

/**
 * 홈 S3 — 시안 C "앱이 내민 완성물 하나 + 사장님 확인 ✓"
 * 메시지: "어려운 건 앱이 합니다. 확인은 사장님이 합니다."
 *   감정 = 간결·안심(쉽다·편하다). 복잡함을 그리지 않는다.
 *   장면 = 앱이 이미 다 끝낸 완성물을 내밀었고, 사장님은 가벼운 확인(✓) 하나만.
 *
 * ⚠ UI가 아니라 개념 그래픽(§8.14-10) — 가짜 문서편집기·버튼·툴바·탭 흉내 금지.
 *   완성물 = 추상 카드 + 가지런한 회색 라인 몇 줄(글자·실제 UI 아님, '완성된 내용'의 은유).
 *   확인 = accent(#0070f3) ✓ 배지 단 하나(우상단 모서리, 절제 §8.14-7).
 *   완성물(회색·조용) vs ✓ 배지(파랑·입체) 대비 = "다 됐어요, 이것만 확인하세요".
 *
 * 기법(§8.14, S2Concept1과 통일):
 *  - radial 입체 채움 + 다층 부드러운 그림자(§8.14-4·5) → 카드가 '내밀어진' 부양감.
 *  - accent는 ✓ 배지 1곳 + 은은한 후광 radial(§8.14-7).
 *  - 배경 도트 = 별도 absolute 레이어 + 타원 mask(콘텐츠엔 미적용 §8.14-6).
 *  - 전부 SVG(preserveAspectRatio meet) → 360폭에서도 비율 유지(§8.14-8).
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;

/* ── 좌표계 (viewBox 560×380) ───────────────────────── */
const VW = 560;
const VH = 380;

/* 앱이 내민 완성물 카드 (중앙) */
const CARD = { x: 130, y: 95, w: 300, h: 190, rx: 18 } as const;
const BADGE = { cx: CARD.x + CARD.w, cy: CARD.y, r: 25 } as const; // 우상단 모서리

/* 완성물 내용 = 가지런한 회색 라인(추상). 첫 줄만 살짝 진하게(위계). */
const LINE_X = CARD.x + 34;
const LINES: readonly { y: number; w: number; sw: number; c: string }[] = [
  { y: 132, w: 138, sw: 5, c: '#aeb4bd' }, // 제목격 라인
  { y: 168, w: 232, sw: 4, c: '#ccd1d8' },
  { y: 196, w: 232, sw: 4, c: '#ccd1d8' },
  { y: 224, w: 208, sw: 4, c: '#ccd1d8' },
  { y: 252, w: 148, sw: 4, c: '#ccd1d8' }, // 마지막 짧은 줄
];

export default function S3GraphicC() {
  return (
    <section className="w-full bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5">
        {/* ── 섹션 헤드 (home.ts homeV2.ourWay 그대로) ── */}
        <div className="mx-auto max-w-[640px] text-center">
          <span
            className="mb-5 inline-block text-xs font-medium tracking-[0.18em] text-text-muted"
            style={{ fontFamily: 'var(--font-en)' }}
          >
            OUR WAY
          </span>
          <h2
            className="text-[clamp(1.7rem,5.2vw,2.7rem)] font-semibold leading-[1.3] tracking-[-0.02em] [text-wrap:balance]"
            style={KR}
          >
            <span className="text-text-muted">어려운 건 앱이 합니다.</span>
            <br />
            <span className="text-text-primary">확인은 사장님이 합니다.</span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-[460px] text-[15px] font-medium leading-[1.5] text-text-body [text-wrap:balance]"
            style={KR}
          >
            앱은 준비하고, 설명하고, 다음 일을 알려드립니다.
            <br />
            사장님은 마지막 확인만 하시면 됩니다.
          </p>
        </div>

        {/* ── 완성물 + 확인 배지 다이어그램 ── */}
        <div
          className="relative mx-auto mt-12 w-full max-w-[520px]"
          style={{ aspectRatio: `${VW} / ${VH}` }}
        >
          {/* 배경 도트: 별도 레이어 + 타원 mask(§8.14-6) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(15,23,42,0.05) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              WebkitMaskImage:
                'radial-gradient(ellipse 78% 74% at 50% 50%, #000 50%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse 78% 74% at 50% 50%, #000 50%, transparent 100%)',
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
              {/* 카드 입체 채움 — 위 밝고 아래 살짝 진하게 */}
              <linearGradient id="s3c-cardFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#f3f5f8" />
              </linearGradient>
              {/* ✓ 배지 입체 채움 — accent radial(위 밝은 파랑 → 아래 진한 파랑) */}
              <radialGradient id="s3c-badgeFill" cx="0.5" cy="0.34" r="0.9">
                <stop offset="0" stopColor="#57a5ff" />
                <stop offset="0.55" stopColor="#0f7bf5" />
                <stop offset="1" stopColor="#005fdd" />
              </radialGradient>
              {/* 배지 후광 — 은은한 accent glow */}
              <radialGradient id="s3c-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#0070f3" stopOpacity="0.22" />
                <stop offset="0.6" stopColor="#0070f3" stopOpacity="0.08" />
                <stop offset="1" stopColor="#0070f3" stopOpacity="0" />
              </radialGradient>
              {/* 카드 다층 부드러운 그림자(§8.14-4) — '내밀어진' 부양감 */}
              <filter id="s3c-cardShadow" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="18" stdDeviation="26" floodColor="#0f172a" floodOpacity="0.11" />
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.07" />
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.06" />
              </filter>
              {/* 배지 다층 그림자 — accent 살짝 얹힌 접지감 */}
              <filter id="s3c-badgeShadow" x="-120%" y="-120%" width="340%" height="340%">
                <feDropShadow dx="0" dy="7" stdDeviation="12" floodColor="#0a4bad" floodOpacity="0.34" />
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0a4bad" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* ① 배지 후광 (가장 아래 — 카드 뒤로도 은은히 번짐) */}
            <circle cx={BADGE.cx} cy={BADGE.cy} r={54} fill="url(#s3c-glow)" />

            {/* ② 앱이 내민 완성물 카드 */}
            <g filter="url(#s3c-cardShadow)">
              <rect
                x={CARD.x}
                y={CARD.y}
                width={CARD.w}
                height={CARD.h}
                rx={CARD.rx}
                fill="url(#s3c-cardFill)"
                stroke="#e2e5ea"
                strokeWidth={1}
              />
            </g>

            {/* ③ 완성된 내용 = 가지런한 회색 라인(추상, 글자 아님) */}
            {LINES.map((l, i) => (
              <line
                key={`ln${i}`}
                x1={LINE_X}
                y1={l.y}
                x2={LINE_X + l.w}
                y2={l.y}
                stroke={l.c}
                strokeWidth={l.sw}
                strokeLinecap="round"
              />
            ))}

            {/* ④ 사장님 확인 ✓ 배지 (우상단 모서리 · 유일한 accent) */}
            <g filter="url(#s3c-badgeShadow)">
              {/* 흰 칼라 — 카드 위에 얹힌 분리감 */}
              <circle cx={BADGE.cx} cy={BADGE.cy} r={BADGE.r + 3.5} fill="#ffffff" />
              {/* accent 입체 디스크 */}
              <circle cx={BADGE.cx} cy={BADGE.cy} r={BADGE.r} fill="url(#s3c-badgeFill)" />
            </g>
            {/* 상단 하이라이트 아크(입체 강조) */}
            <path
              d={`M${BADGE.cx - 13} ${BADGE.cy - 15} A ${BADGE.r - 4} ${BADGE.r - 4} 0 0 1 ${BADGE.cx + 15} ${BADGE.cy - 12}`}
              stroke="#ffffff"
              strokeOpacity={0.45}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* 흰 체크마크 */}
            <path
              d={`M${BADGE.cx - 10} ${BADGE.cy + 0.5} L${BADGE.cx - 3} ${BADGE.cy + 7.5} L${BADGE.cx + 11} ${BADGE.cy - 8.5}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
