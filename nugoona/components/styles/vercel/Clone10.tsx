'use client';

/**
 * Clone10 — Vercel 기능 4분할(2×2) 섹션 1:1 복제 (디자인 학습용)
 * 원본: vercel_image/image-1783929709521.webp (2000×1459)
 * 좌표계 = 원본 이미지 px 그대로 (absolute 배치, 축소 금지)
 *
 * 실측값(픽셀 샘플링):
 * - 배경 #fafafa / 패널 구분선 #ececec (세로 x=310·1071·1831, 수평 y=618, 교차점 십자 마크)
 * - 헤드라인 31px: 강조 600 #171717 + 잔여 400 #666(실측 #626262), 행간 46px
 * - Conformance 카드: 흰색 #fff, 보더 #ebebeb, 내부 열 구분선 #efefef(x=690), 행 스트라이프 #fafafa
 * - teal 도넛 #45dcc5→#50e3c2 / Segment A #f59b13 / Segment B #51d4bb / 파랑 화살표 #57aeff
 * - A/B 분기선 그라디언트: 주황 #f5a623 → 빨강 #e5484d(지그재그) → teal #17b9a0
 * - RES 링 #56c15a(실측 #6fd477 AA) / +25% 배지 bg #e9fbee / FCP 바 #8de394 / LCP 바 #ffc355
 * - 카드 하단 fade-out = CSS mask linear-gradient
 */

const BG = '#fafafa';
const SEP = '#ececec';
const CARD_BORDER = '#ebebeb';
const TXT_DARK = '#171717';
const TXT_GRAY = '#666666';
const TXT_DIM = '#999999';
const TEAL = '#50dcc5';
const ORANGE = '#f5a623';
const BLUE = '#57aeff';
const GREEN = '#56c15a';
const EN = { fontFamily: 'var(--font-en)' } as const;
const MONO = { fontFamily: "ui-monospace, 'SF Mono', 'Menlo', monospace" } as const;

/* ---------- 공용 조각 ---------- */

/** 2톤 헤드라인 (강조 semibold 검정 + 나머지 회색) */
function Headline({ x, y, w, strong, rest }: { x: number; y: number; w: number; strong: string; rest: string }) {
  return (
    <div
      style={{
        ...EN,
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        fontSize: 31,
        lineHeight: '46px',
        letterSpacing: '-0.02em',
        color: TXT_GRAY,
        fontWeight: 400,
      }}
    >
      <span style={{ color: TXT_DARK, fontWeight: 600 }}>{strong}</span> {rest}
    </div>
  );
}

/** 아웃라인(흰 채움 + 회색 획) 텍스트 — 목업 브라우저 안 문구 */
function OutlineText({ children, size = 24 }: { children: React.ReactNode; size?: number }) {
  return (
    <div
      style={{
        ...EN,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.15,
        textAlign: 'center',
        color: '#ffffff',
        WebkitTextStroke: '1.2px #d9d9d9',
        textShadow: '0 1px 2px rgba(0,0,0,0.04)',
        whiteSpace: 'pre-line',
      }}
    >
      {children}
    </div>
  );
}

/** 모눈(그리드) 배경 — 목업 브라우저 본문 */
function gridBg(cell = 14): React.CSSProperties {
  return {
    backgroundImage:
      `repeating-linear-gradient(to right, #f1f1f1 0 1px, transparent 1px ${cell}px),` +
      `repeating-linear-gradient(to bottom, #f1f1f1 0 1px, transparent 1px ${cell}px)`,
  };
}

/** 브라우저 창 상단 점 3개 */
function WindowDots({ x, y, r = 4.5, gap = 13 }: { x: number; y: number; r?: number; gap?: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: x + i * gap - r,
            top: y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            background: '#e0e0e0',
          }}
        />
      ))}
    </>
  );
}

/** 산 모양(선) — 목업 본문 하단 */
function Mountain({ cx, topY, baseY, halfW }: { cx: number; topY: number; baseY: number; halfW: number }) {
  const h = baseY - topY;
  return (
    <svg
      width={halfW * 2}
      height={h}
      viewBox={`0 0 ${halfW * 2} ${h}`}
      style={{ position: 'absolute', left: cx - halfW, top: topY }}
      fill="none"
    >
      <path d={`M0 ${h} L${halfW} 0 L${halfW * 2} ${h}`} stroke="#e4e4e4" strokeWidth="1.5" fill="#fdfdfd" />
    </svg>
  );
}

/* ---------- Q1 좌상 : Conformance / Code Owners ---------- */

function DonutTeal({ cx, cy }: { cx: number; cy: number }) {
  // r=12, 획 4.5, 약 300° 열린 arc (갭 = 우상단)
  const r = 12;
  const c = 2 * Math.PI * r;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ position: 'absolute', left: cx - 16, top: cy - 16 }}>
      <circle
        cx="16"
        cy="16"
        r={r}
        fill="none"
        stroke={TEAL}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray={`${c * 0.82} ${c}`}
        transform="rotate(-55 16 16)"
      />
    </svg>
  );
}

/** 아바타 무리 — 원본은 인물 사진(재현 불가) → 톤 매칭 그라디언트 원으로 대체 */
function AvatarStack({ rightX, cy, tones }: { rightX: number; cy: number; tones: string[] }) {
  const d = 28;
  const overlap = 19; // 중심 간격
  return (
    <>
      {tones.map((t, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: rightX - d - (tones.length - 1 - i) * overlap,
            top: cy - d / 2,
            width: d,
            height: d,
            borderRadius: '50%',
            background: t,
            boxShadow: '0 0 0 2px #ffffff',
            zIndex: i,
          }}
        />
      ))}
    </>
  );
}

function ConformanceRow({
  y,
  label,
  value,
  donut,
}: {
  y: number;
  label: string;
  value: string;
  donut?: boolean;
}) {
  return (
    <div style={{ position: 'absolute', left: 403, top: y, width: 263, height: 77, borderRadius: 8, background: BG }}>
      <span
        style={{ ...EN, position: 'absolute', left: 17, top: 24, fontSize: 25, letterSpacing: '-0.01em', color: TXT_DARK }}
      >
        {label}
      </span>
      {donut && <DonutTeal cx={190} cy={39} />}
      <span
        style={{ ...EN, position: 'absolute', right: 16, top: 24, fontSize: 25, fontWeight: 700, color: TXT_DARK }}
      >
        {value}
      </span>
    </div>
  );
}

function OwnerRow({ y, handle, tones }: { y: number; handle: string; tones: string[] }) {
  return (
    <div style={{ position: 'absolute', left: 714, top: y, width: 268, height: 77, borderRadius: 8, background: BG }}>
      <span style={{ ...EN, position: 'absolute', left: 22, top: 27, fontSize: 20, color: TXT_GRAY }}>{handle}</span>
      <AvatarStack rightX={250} cy={39} tones={tones} />
    </div>
  );
}

function PanelQ1() {
  return (
    <>
      <Headline
        x={379}
        y={12}
        w={630}
        strong="Best practices, built in."
        rest="Static analysis that pushes your performance forward."
      />
      {/* 카드 (하단 fade-out) */}
      <div
        style={{
          position: 'absolute',
          left: 379,
          top: 170,
          width: 623,
          height: 360,
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 96%)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 96%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#ffffff',
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 12,
          }}
        />
        {/* 내부 열 구분선 x=690 (카드 로컬 311) */}
        <div style={{ position: 'absolute', left: 311, top: 0, width: 1, height: '100%', background: '#efefef' }} />
      </div>
      {/* 카드 위 콘텐츠 (fade 마스크와 분리 배치하면 하단 행이 카드와 함께 사라지지 않으므로, 동일 마스크 래퍼로 다시 감싼다) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 2000,
          height: 1459,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0 368px, black 368px 480px, transparent 530px)',
          maskImage: 'linear-gradient(to bottom, black 0 368px, black 368px 480px, transparent 530px)',
        }}
      >
        <span style={{ ...EN, position: 'absolute', left: 403, top: 192, fontSize: 22, fontWeight: 500, color: TXT_DARK }}>
          Conformance
        </span>
        <span style={{ ...EN, position: 'absolute', left: 714, top: 192, fontSize: 22, fontWeight: 500, color: TXT_DARK }}>
          Code Owners
        </span>
        <ConformanceRow y={244} label="Excellent" value="9.5" donut />
        <ConformanceRow y={346} label="Total Issues" value="34" />
        <ConformanceRow y={448} label="Major Issues" value="12" />
        <OwnerRow y={244} handle="@vercel/design" tones={['#5c6f7a', '#b9917a', '#4a4a52']} />
        <OwnerRow y={346} handle="@vercel/eng" tones={['#8aa0b8', '#2f2f38', '#6b5a4e', '#3d4a5c', '#7d8896']} />
        <OwnerRow y={448} handle="@vercel/marketing" tones={['#9db3a4', '#5f83b0', '#8f8f97']} />
      </div>
    </>
  );
}

/* ---------- Q2 우상 : Middleware 개인화 ---------- */

function FlagDE({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 56,
        height: 58,
        borderRadius: 12,
        background: '#ffffff',
        boxShadow: '0 0 0 1px #ececec, 0 4px 10px rgba(0,0,0,0.06)',
        padding: 4,
      }}
    >
      <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, background: '#1a1717' }} />
        <div style={{ flex: 1, background: '#dd3d43' }} />
        <div style={{ flex: 1, background: '#ffb123' }} />
      </div>
    </div>
  );
}

function FlagUS({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 58,
        height: 58,
        borderRadius: 12,
        background: '#ffffff',
        boxShadow: '0 0 0 1px #ececec, 0 4px 10px rgba(0,0,0,0.06)',
        padding: 4,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
        {/* 줄무늬 7개 */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ flex: 1, background: i % 2 === 0 ? '#e0464b' : '#ffffff' }} />
          ))}
        </div>
        {/* 캔톤 + 별 4개 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '46%', height: '43%', background: '#4a90e2' }}>
          <svg width="100%" height="100%" viewBox="0 0 23 21">
            {[
              [7, 7],
              [16, 7],
              [7, 15],
              [16, 15],
            ].map(([sx, sy], i) => (
              <path
                key={i}
                d="M0,-2.6 L0.8,-0.8 L2.6,-0.8 L1.2,0.4 L1.7,2.2 L0,1.2 L-1.7,2.2 L-1.2,0.4 L-2.6,-0.8 L-0.8,-0.8 Z"
                transform={`translate(${sx},${sy})`}
                fill="#ffffff"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

function GlobeBadge({ cx, cy }: { cx: number; cy: number }) {
  const r = 27;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: TXT_DARK,
        boxShadow: '0 0 0 4px ' + BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="10" stroke="#ffffff" strokeWidth="1.6" />
        <ellipse cx="13" cy="13" rx="4.5" ry="10" stroke="#ffffff" strokeWidth="1.4" />
        <path d="M3.6 9.5H22.4M3.6 16.5H22.4" stroke="#ffffff" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

/** 목업 브라우저 창 (그리드 본문 + 아웃라인 문구 + 산) */
function ShipWindow({
  x,
  y,
  w,
  h,
  text,
  textSize = 22,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  textSize?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid #ececec',
        boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
      }}
    >
      <WindowDots x={20} y={22} />
      <div
        style={{
          position: 'absolute',
          left: 15,
          top: 40,
          right: 15,
          bottom: 0,
          border: '1px solid #f0f0f0',
          borderBottom: 'none',
          overflow: 'hidden',
          ...gridBg(14),
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', justifyContent: 'center' }}>
          <OutlineText size={textSize}>{text}</OutlineText>
        </div>
        <Mountain cx={(w - 30) / 2} topY={h - 40 - 88} baseY={h - 41} halfW={40} />
      </div>
    </div>
  );
}

function PanelQ2() {
  return (
    <>
      <Headline
        x={1140}
        y={12}
        w={630}
        strong="Personalize for your audience."
        rest="Pre-render versions of your site with Middleware."
      />
      <ShipWindow x={1140} y={217} w={260} h={200} text={'What will you ship?'} />
      <ShipWindow x={1502} y={345} w={262} h={202} text={'Was wirst\ndu erschaffen?'} />
      {/* 주황(위) / 파랑(아래) 라우팅 화살표 */}
      <svg width="360" height="330" viewBox="0 0 360 330" style={{ position: 'absolute', left: 1260, top: 230 }} fill="none">
        {/* 좌표계: local = global - (1260,230) → 글로브 중심 (191,152) */}
        <path d="M191 122 V62 Q191 20 233 20 H316" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        <path d="M310 12 L322 20 L310 28" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M191 182 V246 Q191 287 149 287 H70" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <path d="M76 279 L64 287 L76 295" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <GlobeBadge cx={1451} cy={382} />
      <FlagDE x={1605} y={219} />
      <FlagUS x={1241} y={490} />
    </>
  );
}

/* ---------- Q3 좌하 : A/B 테스트 분기 ---------- */

/** 분기 라인: 주황 → 빨강 지그재그 → teal, 양끝 아래 화살표 */
function AbBranch() {
  // local 좌표계: left=536, top=980 → global = local + (536,980)
  // 수평 y=22(→1002), 좌 세로 x=15(→551), 우 세로 x=295(→831), 화살표 끝 y=120(→1100)
  return (
    <svg width="310" height="130" viewBox="0 0 310 130" style={{ position: 'absolute', left: 536, top: 980 }} fill="none">
      <defs>
        <linearGradient id="c10-ab" x1="15" y1="0" x2="295" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={ORANGE} />
          <stop offset="0.38" stopColor={ORANGE} />
          <stop offset="0.5" stopColor="#e5484d" />
          <stop offset="0.62" stopColor="#e5484d" />
          <stop offset="0.82" stopColor="#17b9a0" />
          <stop offset="1" stopColor="#17b9a0" />
        </linearGradient>
      </defs>
      <path
        d="M15 118 V46 Q15 22 39 22 H126
           L131 8 L138 36 L145 8 L152 36 L159 8 L164 22
           H271 Q295 22 295 46 V118"
        stroke="url(#c10-ab)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 112 L15 124 L23 112" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M287 112 L295 124 L303 112" stroke="#17b9a0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** /signup 목업 창 + Segment 배지 */
function SignupWindow({
  x,
  y,
  text,
  badge,
  badgeColor,
  pillY = 88,
}: {
  x: number;
  y: number;
  text: string;
  badge: string;
  badgeColor: string;
  pillY?: number;
}) {
  const w = 284;
  const h = 218;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 14,
        background: '#ffffff',
        border: '1px solid #ececec',
        boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
      }}
    >
      <WindowDots x={20} y={22} />
      {/* 자물쇠 + /signup (창 상단 중앙) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
          <rect x="1" y="6" width="11" height="8" rx="1.5" fill={TXT_DARK} />
          <path d="M3.5 6V4.5a3 3 0 0 1 6 0V6" stroke={TXT_DARK} strokeWidth="1.6" fill="none" />
        </svg>
        <span style={{ ...MONO, fontSize: 17, color: TXT_DARK }}>/signup</span>
      </div>
      {/* 그리드 본문 */}
      <div
        style={{
          position: 'absolute',
          left: 15,
          top: 40,
          right: 15,
          bottom: 0,
          border: '1px solid #f0f0f0',
          borderBottom: 'none',
          overflow: 'hidden',
          ...gridBg(14),
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 20, display: 'flex', justifyContent: 'center' }}>
          <OutlineText size={24}>{text}</OutlineText>
        </div>
        {/* 알약 버튼 2개 (채움 / 테두리) */}
        <span
          style={{
            position: 'absolute',
            left: 38,
            top: pillY,
            width: 52,
            height: 17,
            borderRadius: 9,
            background: '#dedede',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: 165,
            top: pillY,
            width: 52,
            height: 17,
            borderRadius: 9,
            background: '#ffffff',
            border: '1.5px solid #e2e2e2',
          }}
        />
      </div>
      {/* Segment 배지 — 카드 우하단 모서리에 밀착 */}
      <div
        style={{
          position: 'absolute',
          right: -1,
          bottom: -1,
          width: 122,
          height: 37,
          background: badgeColor,
          borderRadius: '10px 0 14px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ ...EN, fontSize: 19, fontWeight: 500, color: '#ffffff' }}>{badge}</span>
      </div>
    </div>
  );
}

function PanelQ3() {
  return (
    <>
      <Headline
        x={379}
        y={686}
        w={620}
        strong="Get experimental."
        rest="A/B test without degrading CLS, with Edge Config."
      />
      <AbBranch />
      <SignupWindow x={379} y={1112} text="Create account" badge="Segment A" badgeColor="#f5a623" />
      <SignupWindow x={719} y={1112} text={'Join the\nbest teams'} badge="Segment B" badgeColor="#40d4b8" pillY={98} />
    </>
  );
}

/* ---------- Q4 우하 : Real Experience Score ---------- */

function ScoreRing({ cx, cy }: { cx: number; cy: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'absolute', left: cx - 27, top: cy - 27, width: 54, height: 54 }}>
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle
          cx="27"
          cy="27"
          r={r}
          fill="none"
          stroke={GREEN}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${c * 0.92} ${c}`}
          transform="rotate(-115 27 27)"
        />
      </svg>
      <span
        style={{
          ...EN,
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          fontWeight: 500,
          color: TXT_DARK,
        }}
      >
        92
      </span>
    </div>
  );
}

/** 3분절 진행 바 (긴/중간/짧은 세그먼트 + 세로 마커) */
function VitalsBar({
  x,
  y,
  segments,
  marker,
  dim,
}: {
  x: number;
  y: number;
  segments: { w: number; color: string }[];
  marker?: { at: number; color?: string };
  dim?: boolean;
}) {
  let cursor = 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, height: 10, opacity: dim ? 0.55 : 1 }}>
      {segments.map((s, i) => {
        const left = cursor;
        cursor += s.w + 5;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left,
              top: 3,
              width: s.w,
              height: 4,
              borderRadius: 2,
              background: s.color,
            }}
          />
        );
      })}
      {marker && (
        <span
          style={{
            position: 'absolute',
            left: marker.at,
            top: 0,
            width: 3,
            height: 10,
            borderRadius: 1.5,
            background: marker.color ?? '#2f2f2f',
          }}
        />
      )}
    </div>
  );
}

function VitalTile({
  x,
  y,
  label,
  value,
  unit,
  dim,
  bar,
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  unit?: string;
  dim?: boolean;
  bar: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 274,
        height: 114,
        borderRadius: 10,
        background: BG,
        opacity: dim ? 0.6 : 1,
      }}
    >
      <span style={{ ...EN, position: 'absolute', left: 23, top: 20, fontSize: 18, color: dim ? TXT_DIM : TXT_DARK }}>
        {label}
      </span>
      <span
        style={{
          ...EN,
          position: 'absolute',
          left: 23,
          top: 46,
          fontSize: 26,
          fontWeight: 700,
          color: dim ? TXT_DIM : TXT_DARK,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 16, fontWeight: 400, color: TXT_DIM, marginLeft: 4 }}>{unit}</span>
        )}
      </span>
      {bar}
    </div>
  );
}

function PanelQ4() {
  return (
    <>
      <Headline
        x={1140}
        y={686}
        w={630}
        strong="Observe."
        rest="Tools to measure real user experience on the devices they’re using."
      />
      {/* 큰 카드 (하단 fade-out) */}
      <div
        style={{
          position: 'absolute',
          left: 1140,
          top: 843,
          width: 616,
          height: 470,
          WebkitMaskImage: 'linear-gradient(to bottom, black 58%, transparent 97%)',
          maskImage: 'linear-gradient(to bottom, black 58%, transparent 97%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#ffffff',
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 14,
          }}
        />
        {/* 카드 내부는 로컬 좌표 (global - (1140,843)) */}
        <ScoreRing cx={308} cy={47} />
        <span style={{ ...EN, position: 'absolute', left: 23, top: 90, fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em', color: TXT_DARK }}>
          Real Experience Score
        </span>
        <span
          style={{
            ...EN,
            position: 'absolute',
            left: 265,
            top: 93,
            width: 76,
            height: 30,
            borderRadius: 15,
            background: '#e9fbee',
            color: '#23a353',
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +25%
        </span>
        <div
          style={{
            ...EN,
            position: 'absolute',
            left: 23,
            top: 133,
            width: 545,
            fontSize: 20,
            lineHeight: '29px',
            color: TXT_GRAY,
          }}
        >
          The combined score of your Web Vitals experienced by your visitors.
        </div>
        <VitalTile
          x={23}
          y={209}
          label="First Contentful Paint"
          value="1.01"
          unit="s"
          bar={
            <VitalsBar
              x={23}
              y={87}
              segments={[
                { w: 192, color: '#8de394' },
                { w: 24, color: '#d9d9d9' },
                { w: 8, color: '#d9d9d9' },
              ]}
              marker={{ at: 172 }}
            />
          }
        />
        <VitalTile
          x={320}
          y={209}
          label="Largest Contentful Paint"
          value="1.42"
          unit="s"
          bar={
            <VitalsBar
              x={23}
              y={87}
              segments={[
                { w: 130, color: '#d9d9d9' },
                { w: 82, color: '#ffc355' },
                { w: 8, color: '#d9d9d9' },
              ]}
              marker={{ at: 175 }}
            />
          }
        />
        <VitalTile
          x={23}
          y={337}
          label="Cumulative Layout Shift"
          value="0.02"
          dim
          bar={
            <VitalsBar
              x={23}
              y={87}
              dim
              segments={[
                { w: 192, color: '#c9ecc9' },
                { w: 24, color: '#e3e3e3' },
                { w: 8, color: '#e3e3e3' },
              ]}
              marker={{ at: 172, color: '#9a9a9a' }}
            />
          }
        />
        <VitalTile
          x={320}
          y={337}
          label="Interaction to Next Paint"
          value="1.01"
          unit="s"
          dim
          bar={
            <VitalsBar
              x={23}
              y={87}
              dim
              segments={[
                { w: 192, color: '#c9ecc9' },
                { w: 24, color: '#e3e3e3' },
                { w: 8, color: '#e3e3e3' },
              ]}
              marker={{ at: 172, color: '#9a9a9a' }}
            />
          }
        />
      </div>
    </>
  );
}

/* ---------- 전체 ---------- */

export default function Clone10() {
  return (
    <div
      style={{
        position: 'relative',
        width: 2000,
        height: 1459,
        background: BG,
        overflow: 'hidden',
      }}
    >
      {/* 패널 구분선 */}
      <div style={{ position: 'absolute', left: 310, top: 0, width: 1, height: '100%', background: SEP }} />
      <div style={{ position: 'absolute', left: 1071, top: 0, width: 1, height: '100%', background: SEP }} />
      <div style={{ position: 'absolute', left: 1831, top: 0, width: 1, height: '100%', background: SEP }} />
      <div style={{ position: 'absolute', left: 310, top: 618, width: 1521, height: 1, background: SEP }} />
      {/* 교차점 십자 마크 */}
      <svg width="26" height="26" viewBox="0 0 26 26" style={{ position: 'absolute', left: 1058, top: 605 }}>
        <path d="M13 2V24M2 13H24" stroke="#c2c2c2" strokeWidth="1.5" />
      </svg>

      <PanelQ1 />
      <PanelQ2 />
      <PanelQ3 />
      <PanelQ4 />
    </div>
  );
}
