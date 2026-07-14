'use client';

/**
 * Vercel 디자인 소스 복제 #6 — "The end-to-end platform for AI workloads."
 * (AI Cloud 섹션: 오브 동심호 히어로 + Fluid Compute 파형 카드 + Vercel Sandbox 배선도 + 인용)
 * 원본(image-1783929691591) 1:1 좌표계(1806×1738)로 픽셀 복제.
 * 구성: 좌 고정 라벨/헤딩 컬럼(x101~641) + 우 콘텐츠(x641~1720)
 *  - 상단 오브: 중심(1180,118) 동심 호(실선·점선, 아래로 fade) + ▲ 검은 원 + 로고 칩 2개
 *  - Fluid Compute: 흰 카드 + fluid-1 칩 + 3색 계단 파형(활성 진함/유휴 연함)
 *  - Vercel Sandbox: git push 터미널 → 점선 → ▲ 원 → 3색 곡선 → 자물쇠 스트립 → 디바이스 원 3개
 *  - 하단 인용(Leonardo.Ai)
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const MONO = { fontFamily: 'ui-monospace, SFMono-Regular, "Roboto Mono", Menlo, monospace' } as const;

const BG = '#fafafa';
const GRID = '#ebebeb';
const INK = '#171717';
const GRAY_TXT = '#555555';

/* 파형 색 (실측) */
const BLUE_D = '#1d82fc';
const BLUE_L = '#80b9fe';
const AMBER_D = '#ffb822';
const AMBER_L = '#ffdc90';
const RED_D = '#fa4c5c';
const RED_L = '#fd9aa3';
/* Sandbox 곡선 색 (실측) */
const SB_RED = '#e5484d';
const SB_TEAL = '#45dec4';
const SB_BLUE = '#52aeff';

/* ── 그리드 (실측): 수직 4개 풀하이트 / 수평 3개(우측 영역만) ── */
const V_FULL = [101, 641, 1180, 1720];
const H_RIGHT = [332, 860, 1450];

/** 그리드 교차점 + 마커 */
function Crosshair({ x, y }: { x: number; y: number }) {
  return (
    <svg className="absolute" style={{ left: x - 15, top: y - 15 }} width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <path d="M15 1v28M1 15h28" stroke="#a8a8a8" strokeWidth="1.2" />
    </svg>
  );
}

/** 4포인트 스파클(라벨 아이콘): 큰 별 + 작은 별 2 */
function Sparkle() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill={INK} aria-hidden>
      {/* 큰 별 (중앙 하단) */}
      <path d="M11 8c.9 4.6 1.6 5.3 6.2 6.2-4.6.9-5.3 1.6-6.2 6.2-.9-4.6-1.6-5.3-6.2-6.2C9.4 13.3 10.1 12.6 11 8Z" />
      {/* 작은 별 (좌상) */}
      <path d="M7.2 1.2c.45 2.3.8 2.65 3.1 3.1-2.3.45-2.65.8-3.1 3.1-.45-2.3-.8-2.65-3.1-3.1 2.3-.45 2.65-.8 3.1-3.1Z" />
      {/* 점 별 (우상) */}
      <path d="M18.6 4.4c.3 1.5.5 1.7 2 2-1.5.3-1.7.5-2 2-.3-1.5-.5-1.7-2-2 1.5-.3 1.7-.5 2-2Z" />
    </svg>
  );
}

/** OpenAI 매듭 꽃 (6갈래) */
function OpenAILogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 260 260" fill="none" aria-hidden>
      <path
        d="M239.2 106.5a64.7 64.7 0 0 0-5.6-53.1 65.4 65.4 0 0 0-70.4-31.4A64.7 64.7 0 0 0 114.4 0 65.4 65.4 0 0 0 52 45.3a64.7 64.7 0 0 0-43.2 31.4 65.4 65.4 0 0 0 8 76.7 64.7 64.7 0 0 0 5.6 53.1 65.4 65.4 0 0 0 70.4 31.4 64.7 64.7 0 0 0 48.8 21.8 65.4 65.4 0 0 0 62.4-45.3 64.7 64.7 0 0 0 43.2-31.4 65.4 65.4 0 0 0-8-76.5ZM145.6 243a48.5 48.5 0 0 1-31.1-11.2l1.5-.9 51.7-29.9a8.4 8.4 0 0 0 4.2-7.4v-72.9l21.9 12.6a.8.8 0 0 1 .4.6v60.4a48.7 48.7 0 0 1-48.6 48.7ZM41.2 198.4a48.4 48.4 0 0 1-5.8-32.6l1.5.9 51.7 29.9a8.4 8.4 0 0 0 8.5 0l63.2-36.5v25.3a.8.8 0 0 1-.3.7l-52.3 30.2a48.7 48.7 0 0 1-66.5-17.9ZM27.5 85.4a48.5 48.5 0 0 1 25.3-21.3v61.6a8.4 8.4 0 0 0 4.2 7.4l63.2 36.5-21.9 12.7a.8.8 0 0 1-.8 0L45.3 152a48.7 48.7 0 0 1-17.8-66.6Zm179.7 41.8-63.2-36.5 21.9-12.6a.8.8 0 0 1 .8 0l52.3 30.2a48.7 48.7 0 0 1-7.5 87.9v-61.6a8.4 8.4 0 0 0-4.3-7.4Zm21.8-32.8-1.5-.9-51.7-29.9a8.4 8.4 0 0 0-8.5 0L104.1 100V74.8a.8.8 0 0 1 .3-.7l52.3-30.2a48.7 48.7 0 0 1 72.3 50.5ZM92.2 141.9 70.3 129.3a.8.8 0 0 1-.4-.6V68.3A48.7 48.7 0 0 1 149.7 31l-1.5.9-51.7 29.8a8.4 8.4 0 0 0-4.3 7.4Zm11.9-25.6L132.3 100l28.2 16.3v32.5l-28.2 16.3-28.2-16.3Z"
        fill={INK}
      />
    </svg>
  );
}

/** 각진 방사 매듭 로고 (우측 칩 — 원본 모사 근사) */
function KnotLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke={INK} strokeWidth="1.5" aria-hidden>
      {/* 중심 방사 대각선 + 세로선 */}
      <path d="M14 14 5.5 5.5M14 14l8.5-8.5M14 14 5.5 22.5M14 14l8.5 8.5M14 14V3.5M14 14v10.5" />
      {/* 좌우 ㄷ자 꺾쇠 */}
      <path d="M14 9.5H7.5v9H14" />
      <path d="M14 9.5h6.5v9H14" />
      {/* 상하 꺾임 */}
      <path d="M9 5.5v4M19 5.5v4M9 18.5v4M19 18.5v4" />
    </svg>
  );
}

/** fluid-1 칩(사각 + 8핀 + 내부 곡선 화살표) */
function FluidChip() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="#666666" strokeWidth="1.9" aria-hidden>
      <rect x="5.2" y="5.2" width="16.6" height="16.6" rx="3" />
      {/* 핀: 변당 2개 */}
      <path d="M9.7 5V1.8M17.3 5V1.8M9.7 25.2V22M17.3 25.2V22M5 9.7H1.8M5 17.3H1.8M25.2 9.7H22M25.2 17.3H22" strokeWidth="1.7" />
      {/* 내부 곡선 화살표(↗) */}
      <path d="M9.3 17.2c2.6-.4 4.6-1.9 6.6-5.2" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.6 11.4h3.2v3.2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 자물쇠 아이콘 */
function LockIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" stroke={INK} strokeWidth="2" aria-hidden>
      <rect x="4" y="9.5" width="15" height="10.5" rx="2.4" />
      <path d="M7.4 9.5V7.2a4.1 4.1 0 0 1 8.2 0v2.3" />
    </svg>
  );
}

/** 디바이스 아이콘 3종 */
function MonitorIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" stroke={INK} strokeWidth="2.4" aria-hidden>
      <rect x="2.6" y="4.4" width="21.8" height="14.6" rx="1.6" />
      <path d="M13.5 19v3.4M9 22.8h9" strokeWidth="2.6" />
    </svg>
  );
}
function TabletIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={INK} strokeWidth="2.4" aria-hidden>
      <rect x="4.4" y="2.6" width="17.2" height="20.8" rx="3" />
      <circle cx="8.9" cy="7" r="1.2" fill={INK} stroke="none" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" stroke={INK} strokeWidth="2.4" aria-hidden>
      <rect x="6.6" y="2.6" width="11.8" height="19.8" rx="3.6" />
      <circle cx="10" cy="6.4" r="1.1" fill={INK} stroke="none" />
    </svg>
  );
}

/** 검은 필 버튼 */
function DocsButton({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: x,
        top: y,
        width: 215,
        height: 60,
        borderRadius: 30,
        background: INK,
        color: '#fff',
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        ...EN,
      }}
    >
      Read the docs
    </div>
  );
}

/** 로고 원형 칩(오브 위) */
function OrbChip({ cx, cy, r, children }: { cx: number; cy: number; r: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        background: '#fff',
        border: '1px solid #eaeaea',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </div>
  );
}

/** 디바이스 원형 노드(샌드박스 우측) */
function DeviceCircle({ cx, cy, children }: { cx: number; cy: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: cx - 30.5,
        top: cy - 30.5,
        width: 61,
        height: 61,
        borderRadius: '50%',
        background: '#fff',
        border: '1px solid #e5e5e5',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  );
}

export default function Clone06() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: 1806, height: 1738, background: BG, ...EN }}
      aria-label="Vercel AI Cloud section clone"
    >
      {/* ── 그리드 선 ─────────────────────────────── */}
      {V_FULL.map((x) => (
        <div key={`v${x}`} className="absolute" style={{ left: x, top: 0, width: 1, height: 1738, background: GRID }} />
      ))}
      {H_RIGHT.map((y) => (
        <div key={`h${y}`} className="absolute" style={{ left: 641, top: y, width: 1079, height: 1, background: GRID }} />
      ))}

      {/* ── 상단 오브: 동심 호 + 검은 원(▲) ───────────── */}
      <svg className="absolute" style={{ left: 641, top: 0 }} width="1079" height="332" viewBox="641 0 1079 332" fill="none" aria-hidden>
        <defs>
          {/* 아래로 갈수록 opacity 0 fade */}
          <linearGradient id="c06-arc1" gradientUnits="userSpaceOnUse" x1="1180" y1="0" x2="1180" y2="300">
            <stop offset="0" stopColor="#d9d9d9" />
            <stop offset="1" stopColor="#d9d9d9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="c06-arc2" gradientUnits="userSpaceOnUse" x1="1180" y1="0" x2="1180" y2="280">
            <stop offset="0" stopColor="#e2e2e2" />
            <stop offset="1" stopColor="#e2e2e2" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 실선 호 r=242 / r=328, 점선 호 r=288 / r=311 / r=440 (중심 1180,118) */}
        <circle cx="1180" cy="118" r="242" stroke="url(#c06-arc1)" strokeWidth="1.4" />
        <circle cx="1180" cy="118" r="328" stroke="url(#c06-arc2)" strokeWidth="1.4" />
        <circle cx="1180" cy="118" r="288" stroke="url(#c06-arc1)" strokeWidth="1.4" strokeDasharray="6 8" />
        <circle cx="1180" cy="118" r="311" stroke="url(#c06-arc2)" strokeWidth="1.4" strokeDasharray="6 8" />
        <circle cx="1180" cy="118" r="440" stroke="url(#c06-arc2)" strokeWidth="1.4" strokeDasharray="6 8" />
        {/* 검은 원 주변 옅은 링 */}
        <circle cx="1180" cy="118" r="62" stroke="#e7e7e7" strokeWidth="1.4" />
        <circle cx="1180" cy="118" r="82" stroke="#f2f2f2" strokeWidth="1.4" />
        {/* 검은 원 + 흰 삼각형 */}
        <circle cx="1180" cy="118" r="44" fill={INK} />
        <path d="M1180 102 L1197 133 H1163 Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      {/* 오브 로고 칩 2개 (점선 호 위) */}
      <OrbChip cx={900} cy={50} r={24}>
        <OpenAILogo size={26} />
      </OrbChip>
      <OrbChip cx={1488} cy={75} r={25}>
        <KnotLogo />
      </OrbChip>

      {/* ── 좌측 컬럼: 라벨 + 헤딩 ───────────────────── */}
      <div className="absolute" style={{ left: 172, top: 28 }}>
        <Sparkle />
      </div>
      <div className="absolute" style={{ left: 209, top: 30, fontSize: 20, fontWeight: 500, color: '#525252', letterSpacing: '-0.01em' }}>
        The AI Cloud
      </div>
      <h2
        className="absolute"
        style={{ left: 175, top: 89, fontSize: 43, fontWeight: 700, color: INK, lineHeight: '59px', letterSpacing: '-0.02em', margin: 0 }}
      >
        The end-to-
        <br />
        end platform for
        <br />
        AI workloads.
      </h2>

      {/* ── Fluid Compute 행 ─────────────────────── */}
      <p className="absolute" style={{ left: 714, top: 402, fontSize: 29, lineHeight: '48px', letterSpacing: '-0.01em', color: GRAY_TXT, margin: 0 }}>
        <span style={{ fontWeight: 700, color: INK }}>Fluid Compute.</span> Framework-defined
        <br />
        compute platform designed for
        <br />
        AI workloads.
      </p>
      <DocsButton x={1432} y={405} />

      {/* 파형 카드 */}
      <div
        className="absolute"
        style={{
          left: 716,
          top: 623,
          width: 929,
          height: 163,
          borderRadius: 16,
          background: '#fff',
          border: '1px solid #efefef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      />
      <div className="absolute" style={{ left: 786, top: 691 }}>
        <FluidChip />
      </div>
      <div className="absolute" style={{ left: 822, top: 692, fontSize: 20, color: '#666666', letterSpacing: '-0.01em' }}>
        fluid-1
      </div>
      {/* 3색 계단 파형 — 활성(진함) 세그먼트 → 유휴(연함) 저레벨 → 재활성 */}
      <svg className="absolute" style={{ left: 900, top: 680 }} width="680" height="52" viewBox="900 680 680 52" fill="none" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
        {/* blue */}
        <path d="M922 695.5 H963.5 V711.5" stroke={BLUE_D} />
        <path d="M963.5 711.5 H1414" stroke={BLUE_L} />
        <path d="M1414 711.5 V695.5 H1459" stroke={BLUE_D} />
        {/* amber */}
        <path d="M971 695.5 H1013.5 V715.5" stroke={AMBER_D} />
        <path d="M1013.5 715.5 H1464" stroke={AMBER_L} />
        <path d="M1464 715.5 V695.5 H1508" stroke={AMBER_D} />
        {/* red */}
        <path d="M1022 695.5 H1064.5 V720.5" stroke={RED_D} />
        <path d="M1064.5 720.5 H1516" stroke={RED_L} />
        <path d="M1516 720.5 V695.5 H1560" stroke={RED_D} />
      </svg>

      {/* ── Vercel Sandbox 행 ─────────────────────── */}
      <p className="absolute" style={{ left: 714, top: 930, fontSize: 29, lineHeight: '48px', letterSpacing: '-0.01em', color: GRAY_TXT, margin: 0 }}>
        <span style={{ fontWeight: 700, color: INK }}>Vercel Sandbox.</span> Run untrusted code in a
        <br />
        secure environment.
      </p>
      <DocsButton x={1432} y={933} />

      {/* 3색 곡선(검은 원 → 디바이스) — 자물쇠 스트립이 위에서 가림 */}
      <svg className="absolute" style={{ left: 1130, top: 1090 }} width="470" height="300" viewBox="1130 1090 470 300" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden>
        <path d="M1168 1236 C1258 1213 1282 1131 1432 1131 H1587" stroke={SB_RED} />
        <path d="M1168 1239.5 H1587" stroke={SB_TEAL} />
        <path d="M1168 1243 C1258 1266 1282 1347.5 1432 1347.5 H1587" stroke={SB_BLUE} />
      </svg>

      {/* 큰 박스(테두리만, 내부 투명 → 곡선 노출) */}
      <div
        className="absolute"
        style={{ left: 1016, top: 1099, width: 363, height: 279, borderRadius: 16, border: '1px solid #ededed', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
      />
      {/* 자물쇠 스트립: 불투명 배경으로 곡선을 가림 (3칸) */}
      <div
        className="absolute"
        style={{ left: 1317, top: 1100, width: 61, height: 277, background: BG, borderLeft: '1px solid #efefef', borderRadius: '0 15px 15px 0' }}
      >
        <div className="absolute" style={{ left: 0, top: 92, width: 61, height: 1, background: '#e6e6e6' }} />
        <div className="absolute" style={{ left: 0, top: 185, width: 61, height: 1, background: '#e6e6e6' }} />
        <div className="absolute" style={{ left: 19, top: 35 }}><LockIcon /></div>
        <div className="absolute" style={{ left: 19, top: 127 }}><LockIcon /></div>
        <div className="absolute" style={{ left: 19, top: 219 }}><LockIcon /></div>
      </div>

      {/* git push 터미널 카드 */}
      <div
        className="absolute"
        style={{ left: 712, top: 1189, width: 201, height: 99, borderRadius: 14, background: '#fbfbfb', border: '1px solid #efefef', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="absolute flex" style={{ left: 22, top: 18, gap: 7 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0e0e0' }} />
          ))}
        </div>
        <div className="absolute flex items-center" style={{ left: 22, top: 54, gap: 9 }}>
          <svg width="12" height="11" viewBox="0 0 12 11" aria-hidden>
            <path d="M6 0 L12 11 H0 Z" fill="#333" />
          </svg>
          <span style={{ fontSize: 18, color: '#4d4d4d', letterSpacing: '0.02em', ...MONO }}>~ git push</span>
        </div>
      </div>

      {/* 터미널 → 박스 점선(끝으로 갈수록 fade 반복) + 박스 안 실선 */}
      <svg className="absolute" style={{ left: 913, top: 1233 }} width="230" height="13" viewBox="913 1233 230 13" fill="none" aria-hidden>
        <defs>
          <linearGradient id="c06-dash" gradientUnits="userSpaceOnUse" x1="913" y1="0" x2="1012" y2="0">
            <stop offset="0" stopColor="#a8a8a8" />
            <stop offset="0.45" stopColor="#a8a8a8" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#a8a8a8" />
            <stop offset="0.95" stopColor="#a8a8a8" stopOpacity="0.15" />
            <stop offset="1" stopColor="#a8a8a8" />
          </linearGradient>
        </defs>
        <path d="M913 1239.5 H1012" stroke="url(#c06-dash)" strokeWidth="2" strokeDasharray="7 3" />
        <path d="M1012 1239.5 H1140" stroke="#a8a8a8" strokeWidth="2" />
      </svg>

      {/* 검은 원 + 흰 outline 삼각형 (샌드박스) */}
      <div className="absolute" style={{ left: 1137.5, top: 1208.5, width: 60, height: 60, borderRadius: '50%', background: INK }}>
        <svg className="absolute" style={{ left: 17, top: 19 }} width="26" height="23" viewBox="0 0 26 23" fill="none" aria-hidden>
          <path d="M13 2 L23.8 21 H2.2 Z" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 디바이스 원 3개 */}
      <DeviceCircle cx={1616.5} cy={1130.5}><MonitorIcon /></DeviceCircle>
      <DeviceCircle cx={1616.5} cy={1238.5}><TabletIcon /></DeviceCircle>
      <DeviceCircle cx={1616.5} cy={1346.5}><PhoneIcon /></DeviceCircle>

      {/* ── 인용 ─────────────────────────────────── */}
      <span className="absolute" style={{ left: 682, top: 1505, fontSize: 32, fontWeight: 700, color: INK, letterSpacing: '-0.05em' }}>
        &quot;
      </span>
      <p className="absolute" style={{ left: 714, top: 1503, fontSize: 26, lineHeight: '53.5px', color: INK, letterSpacing: '-0.005em', margin: 0 }}>
        Switching to Vercel transformed our workflow at Leonardo.Ai,
        <br />
        cutting build times from 10 minutes to just 2 minutes. Vercel didn&apos;t
        <br />
        just speed us up; it changed how we innovate.{' '}
        <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.05em', position: 'relative', top: -6 }}>&quot;</span>
      </p>

      {/* ── 크로스헤어 마커 (그리드 위) ─────────────── */}
      <Crosshair x={641} y={332} />
      <Crosshair x={1720} y={860} />
      <Crosshair x={641} y={1450} />
    </div>
  );
}
