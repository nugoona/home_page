'use client';

/**
 * Vercel 디자인 소스 복제 #5 — "Infrastructure for AI." (AI Cloud 히어로 + AI Gateway 궤도 다이어그램).
 * 원본(image-1783929639439) 1:1 좌표계(1909×1708)로 픽셀 복제.
 * 상단: 그리드(135px 셀) + 다크 말풍선(타이핑 커서·우하단 꼬리) + 흰 말풍선(헤드라인 + Get a Demo 버튼, 좌하단 꼬리)
 * 하단: 좌 "The AI Cloud" 라벨 + 3줄 헤딩 / 우 AI Gateway 단락 + Read the docs 필 버튼
 *       + 동심 궤도(점선 2 + 실선 1, 중심은 화면 하단 밖) 위 프로바이더 로고 칩 7개 + 중앙 ▲ 원.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

const BG = '#fafafa';
const GRID = '#ebebeb';
const INK = '#171717';
const GRAY_TXT = '#4d4d4d';

/* ── 그리드 좌표 (실측) ───────────────────────────────── */
// 풀하이트 수직선 4개 / 상단 전용 수직선 9개 / 상단 수평선 7개 + 섹션 경계선 y859
const V_FULL = [190, 730, 1269, 1809];
const V_TOP = [325, 460, 595, 864, 999, 1134, 1404, 1539, 1674];
const H_TOP = [25, 160, 295, 430, 565, 700, 835];

/** 크로스헤어 + (그리드 교차점 마커) */
function Crosshair({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="absolute"
      style={{ left: x - 16, top: y - 16 }}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden
    >
      <path d="M16 1v30M1 16h30" stroke="#a3a3a3" strokeWidth="1.5" />
    </svg>
  );
}

/** 다크 말풍선 꼬리 (우하단, iMessage sent 스타일) — 실측 tip ≈ (1694, 297) */
function DarkTail() {
  return (
    <svg
      className="absolute"
      style={{ left: 1620, top: 232 }}
      width="80"
      height="68"
      viewBox="0 0 80 68"
      aria-hidden
    >
      <path d="M8 0h24c0 26 14 46 42 64-30 2-52-10-66-32L8 20Z" fill={INK} />
    </svg>
  );
}

/** 흰 말풍선 꼬리 (좌하단, received 스타일) — 실측 tip ≈ (322, 708) */
function WhiteTail() {
  return (
    <svg
      className="absolute"
      style={{ left: 300, top: 646 }}
      width="80"
      height="66"
      viewBox="0 0 80 66"
      aria-hidden
    >
      <path d="M72 0H44c0 26-12 44-38 62 28 2 48-10 62-30l4-12Z" fill="#ffffff" />
    </svg>
  );
}

/** Vercel ▲ (검정 삼각형) */
function VercelTriangle({ size, color = INK }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5 22.5 21.5H1.5Z" fill={color} />
    </svg>
  );
}

/** ✦ 스파클 아이콘 (큰 4각별 + 작은 별 2) */
function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M13 8c.7 3.4 2.6 5.3 6 6-3.4.7-5.3 2.6-6 6-.7-3.4-2.6-5.3-6-6 3.4-.7 5.3-2.6 6-6Z"
        fill="#333333"
      />
      <path d="M7.2 3.4c.32 1.5 1.14 2.34 2.65 2.66-1.51.32-2.33 1.15-2.65 2.66-.32-1.51-1.14-2.34-2.65-2.66 1.51-.32 2.33-1.16 2.65-2.66Z" fill="#333333" />
      <path d="M19.6 4.6c.25 1.2.9 1.86 2.1 2.1-1.2.26-1.85.92-2.1 2.12-.26-1.2-.9-1.86-2.1-2.11 1.2-.25 1.84-.9 2.1-2.11Z" fill="#333333" />
    </svg>
  );
}

/* ── 프로바이더 로고 (원본 모사·간이 재현) ───────────────── */

/** Meta ∞ */
function MetaLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path
        d="M3.2 16.6c0-3.9 2-7.2 4.4-7.2 1.9 0 3 1.5 5.4 5.1 2.3 3.5 3.4 4.9 5.3 4.9 2.1 0 4.5-2.7 4.5-6.5"
        stroke={INK}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M22.8 12.9c0-3.7-2.3-6.7-4.4-6.7-1.6 0-2.9 1.2-4.5 3.5"
        stroke={INK}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M3.2 16.6c0 2.3 1 3.9 2.6 3.9 1.5 0 2.6-1.2 4.4-4" stroke={INK} strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

/** OpenAI 매듭 꽃 (6갈래) */
function OpenAILogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 260 260" fill="none" aria-hidden>
      <path
        d="M239.2 106.5a64.7 64.7 0 0 0-5.6-53.1 65.4 65.4 0 0 0-70.4-31.4A64.7 64.7 0 0 0 114.4 0 65.4 65.4 0 0 0 52 45.3a64.7 64.7 0 0 0-43.2 31.4 65.4 65.4 0 0 0 8 76.7 64.7 64.7 0 0 0 5.6 53.1 65.4 65.4 0 0 0 70.4 31.4 64.7 64.7 0 0 0 48.8 21.8 65.4 65.4 0 0 0 62.4-45.3 64.7 64.7 0 0 0 43.2-31.4 65.4 65.4 0 0 0-8-76.5ZM145.6 243a48.5 48.5 0 0 1-31.1-11.2l1.5-.9 51.7-29.9a8.4 8.4 0 0 0 4.2-7.4v-72.9l21.9 12.6a.8.8 0 0 1 .4.6v60.4a48.7 48.7 0 0 1-48.6 48.7ZM41.2 198.4a48.4 48.4 0 0 1-5.8-32.6l1.5.9 51.7 29.9a8.4 8.4 0 0 0 8.5 0l63.2-36.5v25.3a.8.8 0 0 1-.3.7l-52.3 30.2a48.7 48.7 0 0 1-66.5-17.9ZM27.5 85.4a48.5 48.5 0 0 1 25.3-21.3v61.6a8.4 8.4 0 0 0 4.2 7.4l63.2 36.5-21.9 12.7a.8.8 0 0 1-.8 0L45.3 152a48.7 48.7 0 0 1-17.8-66.6Zm179.7 41.8-63.2-36.5 21.9-12.6a.8.8 0 0 1 .8 0l52.3 30.2a48.7 48.7 0 0 1-7.5 87.9v-61.6a8.4 8.4 0 0 0-4.3-7.4Zm21.8-32.8-1.5-.9-51.7-29.9a8.4 8.4 0 0 0-8.5 0L104.1 100V74.8a.8.8 0 0 1 .3-.7l52.3-30.2a48.7 48.7 0 0 1 72.3 50.5ZM92.2 141.9 70.3 129.3a.8.8 0 0 1-.4-.6V68.3A48.7 48.7 0 0 1 149.7 31l-1.5.9-51.7 29.8a8.4 8.4 0 0 0-4.3 7.4Zm11.9-25.6L132.3 100l28.2 16.3v32.5l-28.2 16.3-28.2-16.3Z"
        fill={INK}
      />
    </svg>
  );
}

/** 방사형 노드(점+화살표) 로고 */
function NodeLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <circle cx="15" cy="15" r="2" fill={INK} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 15 15)`}>
          <path d="M15 8.6V5.4M13.4 6.8 15 5.2l1.6 1.6" stroke={INK} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

/** 이중 산(∧∧) 로고 */
function PeaksLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="m3 19 6.2-9.5 4.6 6.7" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m10.8 19 6.3-9.5L25 19Z" fill={INK} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

/** 픽셀 M (Mistral 스타일) */
function PixelMLogo() {
  const px = 3.4;
  // 5×5 픽셀 M
  const cells: Array<[number, number]> = [
    [0, 0], [4, 0],
    [0, 1], [1, 1], [3, 1], [4, 1],
    [0, 2], [2, 2], [4, 2],
    [0, 3], [4, 3],
    [0, 4], [4, 4],
  ];
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      {cells.map(([cx, cy], i) => (
        <rect key={i} x={3.5 + cx * px} y={3.5 + cy * px} width={px - 0.6} height={px - 0.6} fill={INK} />
      ))}
    </svg>
  );
}

/** 겹친 프레임(⌐ 3중) 로고 */
function FramesLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path d="M4 21V5h16" stroke={INK} strokeWidth="2.2" />
      <path d="M9 21V10h11" stroke={INK} strokeWidth="2.2" />
      <path d="M14 21v-6h6" stroke={INK} strokeWidth="2.2" />
    </svg>
  );
}

/** 격자 눈꽃(✳) 로고 */
function SnowLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path d="M13 3v20M4.3 8v10M21.7 8v10M4.3 8 13 13l8.7-5M4.3 18 13 13l8.7 5" stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 궤도 위 프로바이더 칩 (흰 원 + 옅은 테두리) */
function Chip({
  cx,
  cy,
  r,
  children,
}: {
  cx: number;
  cy: number;
  r: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full bg-white"
      style={{
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        border: '1px solid #e8e8e8',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </div>
  );
}

export default function Clone05() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: 1909, height: 1708, backgroundColor: BG, ...EN }}
    >
      {/* ── 그리드 ── */}
      <svg className="absolute inset-0" width="1909" height="1708" aria-hidden>
        {V_FULL.map((x) => (
          <line key={`vf${x}`} x1={x + 0.5} y1={25} x2={x + 0.5} y2={1708} stroke={GRID} strokeWidth="1" />
        ))}
        {V_TOP.map((x) => (
          <line key={`vt${x}`} x1={x + 0.5} y1={25} x2={x + 0.5} y2={835} stroke={GRID} strokeWidth="1" />
        ))}
        {H_TOP.map((y) => (
          <line key={`h${y}`} x1={190} y1={y + 0.5} x2={1809} y2={y + 0.5} stroke={GRID} strokeWidth="1" />
        ))}
        {/* 섹션 경계선 */}
        <line x1={190} y1={859.5} x2={1809} y2={859.5} stroke={GRID} strokeWidth="1" />
      </svg>

      {/* ── 크로스헤어 마커 ── */}
      <Crosshair x={190} y={25} />
      <Crosshair x={1809} y={835} />

      {/* ── 최상단 잘린 다크 요소(원본에서 위 섹션 꼬리) ── */}
      <div className="absolute" style={{ left: 1108, top: 0, width: 198, height: 2, backgroundColor: INK }} />

      {/* ── 다크 말풍선 "Infrastructure for AI." ── */}
      <DarkTail />
      <div
        className="absolute"
        style={{ left: 1082, top: 160, width: 590, height: 135, borderRadius: 68, backgroundColor: INK }}
      >
        <span
          className="absolute whitespace-nowrap text-white"
          style={{ left: 64, top: 34, fontSize: 47, lineHeight: '66px', fontWeight: 600, letterSpacing: '-0.5px' }}
        >
          Infrastructure for AI.
        </span>
        {/* 타이핑 커서 블록 */}
        <div
          className="absolute"
          style={{ left: 506, top: 50, width: 30, height: 38, borderRadius: 3, backgroundColor: '#323232' }}
        />
      </div>

      {/* ── 흰 말풍선 (헤드라인 + 버튼) ── */}
      <WhiteTail />
      <div
        className="absolute bg-white"
        style={{ left: 324, top: 431, width: 1346, height: 269, borderRadius: 68 }}
      >
        <div
          className="absolute"
          style={{ left: 73, top: 80, fontSize: 44, lineHeight: '48px', letterSpacing: '-0.5px' }}
        >
          <div style={{ color: INK, fontWeight: 600 }}>Ship intelligent, secure applications</div>
          <div style={{ color: GRAY_TXT, fontWeight: 500 }}>with the cloud built for AI.</div>
        </div>
        {/* Get a ▲ Demo */}
        <button
          type="button"
          className="absolute flex items-center justify-center bg-white"
          style={{
            left: 1060,
            top: 102,
            width: 219,
            height: 63,
            borderRadius: 32,
            border: '1px solid #ececec',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            gap: 8,
            fontSize: 24,
            fontWeight: 500,
            color: INK,
            ...EN,
          }}
        >
          Get a
          <VercelTriangle size={24} />
          Demo
        </button>
      </div>

      {/* ── 하단 좌측: 라벨 + 헤딩 ── */}
      <div className="absolute flex items-center" style={{ left: 262, top: 1074, gap: 10 }}>
        <SparkleIcon />
        <span style={{ fontSize: 20, fontWeight: 500, color: '#555555' }}>The AI Cloud</span>
      </div>
      <div
        className="absolute"
        style={{ left: 264, top: 1136, fontSize: 44, lineHeight: '60px', fontWeight: 600, color: INK, letterSpacing: '-0.5px' }}
      >
        The end-to-
        <br />
        end platform for
        <br />
        AI workloads.
      </div>

      {/* ── 하단 우측: AI Gateway 단락 ── */}
      <p
        className="absolute"
        style={{ left: 805, top: 1071, width: 645, fontSize: 29, lineHeight: '48px', fontWeight: 400, color: '#4f4f4f', letterSpacing: '-0.2px' }}
      >
        <span style={{ color: INK, fontWeight: 600 }}>AI Gateway.</span> Switch between AI models
        without needing to manage API keys, rate
        limits, or provider accounts.
      </p>

      {/* ── Read the docs 버튼 ── */}
      <button
        type="button"
        className="absolute flex items-center justify-center text-white"
        style={{
          left: 1521,
          top: 1070,
          width: 214,
          height: 59,
          borderRadius: 30,
          backgroundColor: INK,
          fontSize: 23,
          fontWeight: 500,
          ...EN,
        }}
      >
        Read the docs
      </button>

      {/* ── 궤도 다이어그램 ── */}
      <svg className="absolute inset-0" width="1909" height="1708" aria-hidden>
        <defs>
          {/* 궤도 하단으로 갈수록 옅어지는 fade (userSpaceOnUse) */}
          <linearGradient id="c05-ring-dash" gradientUnits="userSpaceOnUse" x1="1270" y1="1290" x2="1270" y2="1708">
            <stop offset="0" stopColor="#d9d9d9" />
            <stop offset="0.8" stopColor="#d9d9d9" />
            <stop offset="1" stopColor="#d9d9d9" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="c05-ring-solid" gradientUnits="userSpaceOnUse" x1="1270" y1="1370" x2="1270" y2="1708">
            <stop offset="0" stopColor="#e2e2e2" />
            <stop offset="0.85" stopColor="#e2e2e2" />
            <stop offset="1" stopColor="#e2e2e2" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {/* 중심(1270,1762)은 화면 하단 밖 — 위쪽 반원만 노출 */}
        <circle cx="1270" cy="1762" r="300" fill="none" stroke="url(#c05-ring-dash)" strokeWidth="1.5" strokeDasharray="5 8" />
        <circle cx="1270" cy="1762" r="377" fill="none" stroke="url(#c05-ring-solid)" strokeWidth="1.5" />
        <circle cx="1270" cy="1762" r="449" fill="none" stroke="url(#c05-ring-dash)" strokeWidth="1.5" strokeDasharray="5 8" />
        {/* 중앙 검은 원 주위 잔물결 링 */}
        <circle cx="1268" cy="1594" r="65" fill="none" stroke="#eaeaea" strokeWidth="1" />
        <circle cx="1268" cy="1594" r="83" fill="none" stroke="#ededed" strokeWidth="1" />
        {/* 중앙 검은 원 + ▲ */}
        <circle cx="1268" cy="1595" r="45" fill={INK} />
        <path d="M1268 1577.5 1287.5 1611.5h-39Z" fill="#ffffff" />
      </svg>

      {/* ── 프로바이더 칩 (궤도 위) ── */}
      <Chip cx={1309} cy={1318} r={25}>
        <FramesLogo />
      </Chip>
      <Chip cx={1021} cy={1392} r={25}>
        <MetaLogo />
      </Chip>
      <Chip cx={1167} cy={1403} r={26}>
        <NodeLogo />
      </Chip>
      <Chip cx={1427} cy={1420} r={25}>
        <PeaksLogo />
      </Chip>
      <Chip cx={1554} cy={1416} r={25}>
        <PixelMLogo />
      </Chip>
      <Chip cx={989} cy={1528} r={25}>
        <OpenAILogo />
      </Chip>
      <Chip cx={1577} cy={1555} r={24}>
        <SnowLogo />
      </Chip>
    </div>
  );
}
