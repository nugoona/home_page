'use client';

/**
 * Vercel 디자인 소스 복제 #2 — "Routing, billing, and observability in one place" (AI Gateway 3열 카드).
 * 원본(image-1783929625568) 1:1 좌표계(2000×923)로 픽셀 복제.
 * 좌상단 헤드라인 / 우측 회색 서브텍스트 / 3열 카드(방사형 API 허브 · 라우팅 플로우차트 · 요금 명세) / 하단 3열 캡션.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

/* ---------- 색 토큰 (이미지 실측) ---------- */
const C = {
  bg: '#fafafa',
  border: '#e8e8e8',
  ray: '#e9e9e9',
  ink: '#111111',
  gray: '#494949',
  label: '#a6a6a6',
} as const;

/* ---------- Vercel 삼각형 ---------- */
function Triangle({ size, color = '#1a1a1a' }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.866} viewBox="0 0 100 86.6" fill={color} aria-hidden>
      <path d="M50 0 100 86.6H0Z" />
    </svg>
  );
}

/* ---------- API 배지 (pill 내부) ---------- */
function ApiBadge() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 44,
        height: 31,
        borderRadius: 9,
        border: '2.5px solid #1a1a1a',
      }}
    >
      <span style={{ ...EN, fontSize: 14, fontWeight: 800, letterSpacing: '0.02em', color: '#1a1a1a', lineHeight: 1 }}>
        API
      </span>
    </div>
  );
}

/* ---------- 문서 아이콘 (말풍선 안) ---------- */
function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="4" y="2.5" width="14" height="17" rx="2.5" stroke="#1a1a1a" strokeWidth="1.8" />
      <path d="M7.5 7.5h7M7.5 11h7M7.5 14.5h4.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- 경고 아이콘 (채운 둥근 삼각형 + 흰 느낌표) ---------- */
function WarnIcon() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" aria-hidden>
      <path
        d="M10.1 1.6a2.2 2.2 0 0 1 3.8 0l9 15.6a2.2 2.2 0 0 1-1.9 3.3H2.9A2.2 2.2 0 0 1 1 17.2Z"
        fill="#1a1a1a"
      />
      <rect x="10.9" y="7" width="2.2" height="6.4" rx="1.1" fill="#ffffff" />
      <circle cx="12" cy="16.2" r="1.35" fill="#ffffff" />
    </svg>
  );
}

/* ---------- 체크 아이콘 ---------- */
function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4.5 12.5 9.5 17.5 19.5 7" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- 프로바이더 로고 (회색, 24px) ---------- */
function OpenAiLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={C.label} aria-hidden>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zM13.2599 22.4301a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.0615v5.5826a4.504 4.504 0 0 1-4.4945 4.4849zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6455zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function AnthropicLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={C.label} aria-hidden>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

function XAiLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={C.label} aria-hidden>
      <path d="m3.005 8.858 8.783 12.544h3.904L6.908 8.858zM6.905 15.825 3 21.402h3.907l1.951-2.788zM16.585 2l-6.75 9.64 1.953 2.79L20.492 2zM17.292 7.965v13.437h3.2V3.395z" />
    </svg>
  );
}

/* ---------- 열 3: 요금 행 ---------- */
function FeeRow({
  icon,
  label,
  price,
  centerY,
  bold = false,
}: {
  icon?: React.ReactNode;
  label: string;
  price: string;
  centerY: number;
  bold?: boolean;
}) {
  const color = bold ? C.ink : C.label;
  return (
    <>
      <div className="absolute flex items-center" style={{ left: 1384, top: centerY - 15, height: 30, gap: 10 }}>
        {icon}
        <span style={{ ...EN, fontSize: bold ? 21 : 20, fontWeight: bold ? 600 : 400, color, lineHeight: 1 }}>
          {label}
        </span>
      </div>
      <div className="absolute" style={{ right: 2000 - 1837, top: centerY - 15, height: 30, display: 'flex', alignItems: 'center' }}>
        <span style={{ ...EN, fontSize: bold ? 21 : 20, fontWeight: bold ? 600 : 400, color, lineHeight: 1 }}>
          {price}
        </span>
      </div>
    </>
  );
}

/* ---------- 열 1: 방사형 점 좌표 (SVG 로컬 = 카드 열1 기준 570×515) ---------- */
const HUB = { x: 285, y: 237 } as const; // pill 중심
const DOTS: ReadonlyArray<readonly [number, number]> = [
  [155, 85], [218, 75], [297, 88], [266, 126], [420, 139], [501, 157],
  [331, 169], [195, 183], [120, 238], [82, 308], [172, 330], [235, 295],
  [280, 349], [313, 386], [420, 377], [423, 276], [329, 312], [568, 418],
];
/** 점 없이 프레임 밖으로 이어지는 선 끝점 */
const RAY_EXITS: ReadonlyArray<readonly [number, number]> = [
  [380, 0], [0, 155], [165, 515], [570, 264],
];

export default function Clone02() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ ...EN, width: 2000, height: 923, backgroundColor: C.bg }}
    >
      {/* ── 헤드라인 (좌상단, 2줄) ── */}
      <h2
        className="absolute"
        style={{
          left: 185,
          top: 24,
          fontSize: 72,
          lineHeight: '72px',
          fontWeight: 600,
          letterSpacing: '-0.045em',
          color: C.ink,
        }}
      >
        Routing, billing, and
        <br />
        observability in one place
      </h2>

      {/* ── 우측 서브텍스트 (2줄) ── */}
      <p
        className="absolute"
        style={{ left: 1202, top: 88, fontSize: 20, lineHeight: '34px', color: C.gray }}
      >
        Providing the developer experience and infrastructure to build,
        <br />
        scale, and secure a faster, more personalized web.
      </p>

      {/* ── 카드 프레임 (1712×515) + 열 구분선 2개 ── */}
      <div
        className="absolute"
        style={{ left: 185, top: 251, width: 1712, height: 515, border: `1px solid ${C.border}` }}
      />
      <div className="absolute" style={{ left: 755, top: 252, width: 1, height: 513, backgroundColor: '#eeeeee' }} />
      <div className="absolute" style={{ left: 1325, top: 252, width: 1, height: 513, backgroundColor: C.border }} />

      {/* ══════════ 열 1 — 방사형 API 허브 ══════════ */}
      <svg
        className="absolute"
        style={{ left: 186, top: 252 }}
        width={569}
        height={513}
        viewBox="0 0 569 513"
        fill="none"
        aria-hidden
      >
        {/* 방사선: 허브 중심 → 각 점/프레임 밖 */}
        {DOTS.map(([x, y], i) => (
          <line key={`d${i}`} x1={HUB.x} y1={HUB.y} x2={x} y2={y} stroke={C.ray} strokeWidth="1.2" />
        ))}
        {RAY_EXITS.map(([x, y], i) => (
          <line key={`e${i}`} x1={HUB.x} y1={HUB.y} x2={x} y2={y} stroke={C.ray} strokeWidth="1.2" />
        ))}
        {/* 끝점 검은 점 (r5) */}
        {DOTS.map(([x, y], i) => (
          <circle key={`c${i}`} cx={x} cy={y} r="5" fill="#1a1a1a" />
        ))}
      </svg>
      {/* 중앙 pill: ▲ + [API] */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: 402,
          top: 452,
          width: 136,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#ffffff',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          gap: 13,
        }}
      >
        <Triangle size={32} />
        <ApiBadge />
      </div>

      {/* ══════════ 열 2 — 라우팅 플로우 ══════════ */}
      <svg
        className="absolute"
        style={{ left: 756, top: 252 }}
        width={569}
        height={513}
        viewBox="0 0 569 513"
        fill="none"
        aria-hidden
      >
        <defs>
          {/* 말풍선→원 수직선: 위 연함 → 아래 진함 */}
          <linearGradient id="cl02-drop" gradientUnits="userSpaceOnUse" x1="284" y1="126" x2="284" y2="182">
            <stop offset="0" stopColor="#dcdcdc" />
            <stop offset="1" stopColor="#8a8a8a" />
          </linearGradient>
          {/* 체크 원 오른쪽 수평선: 끝 opacity 0 fade */}
          <linearGradient id="cl02-fade" gradientUnits="userSpaceOnUse" x1="404" y1="386" x2="497" y2="386">
            <stop offset="0" stopColor="#8f8f8f" />
            <stop offset="1" stopColor="#8f8f8f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 수직선 (말풍선 아래 → 큰 원) */}
        <line x1="284" y1="126" x2="284" y2="182" stroke="url(#cl02-drop)" strokeWidth="1.6" />
        {/* 점선 분기 (큰 원 → 경고 원) */}
        <path
          d="M273 276 273 320 Q273 334 259 334 L202 334 Q188 334 188 348 L188 360"
          stroke="#c9c9c9"
          strokeWidth="1.6"
          strokeDasharray="5 6"
        />
        {/* 실선 분기 (큰 원 → 체크 원) */}
        <path
          d="M297 276 297 314 Q297 328 311 328 L364 328 Q378 328 378 342 L378 360"
          stroke="#6f6f6f"
          strokeWidth="1.6"
        />
        {/* 체크 원 오른쪽 수평선 (끝 fade) */}
        <line x1="404" y1="386" x2="497" y2="386" stroke="url(#cl02-fade)" strokeWidth="1.6" />
      </svg>

      {/* 말풍선 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: 850,
          top: 311,
          width: 380,
          height: 67,
          borderRadius: 33.5,
          backgroundColor: '#ffffff',
          boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
          gap: 9,
        }}
      >
        <span style={{ ...EN, fontSize: 21, color: '#1a1a1a', lineHeight: 1 }}>Summarize this</span>
        <DocIcon />
        <span
          style={{
            ...EN,
            fontSize: 21,
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1,
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            textDecorationThickness: 2,
          }}
        >
          technical-spec.pdf
        </span>
      </div>
      {/* 말풍선 꼬리 (우하단) */}
      <svg className="absolute" style={{ left: 1198, top: 352 }} width="44" height="34" viewBox="0 0 44 34" aria-hidden>
        <path d="M0 0C4 14 16 24 32 26 24 30 10 27 2 16Z" fill="#ffffff" />
      </svg>

      {/* 큰 원 + 삼각형 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: 992,
          top: 433,
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Triangle size={52} />
      </div>

      {/* 경고 원 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: 917,
          top: 612,
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 3px 10px rgba(0,0,0,0.07)',
        }}
      >
        <WarnIcon />
      </div>

      {/* 체크 원 */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: 1107,
          top: 612,
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 3px 10px rgba(0,0,0,0.07)',
        }}
      >
        <CheckIcon />
      </div>

      {/* ══════════ 열 3 — 요금 명세 ══════════ */}
      <FeeRow icon={<OpenAiLogo />} label="OpenAI" price="$12.47" centerY={368} />
      <FeeRow icon={<AnthropicLogo />} label="Anthropic" price="$8.22" centerY={418} />
      <FeeRow icon={<XAiLogo />} label="xAI" price="$4.31" centerY={470} />
      <div className="absolute" style={{ left: 1384, top: 502, width: 453, height: 1, backgroundColor: C.border }} />
      <FeeRow icon={<Triangle size={24} color="#111111" />} label="Platform fee" price="$0.00" centerY={540} bold />
      <div className="absolute" style={{ left: 1384, top: 572, width: 453, height: 1, backgroundColor: C.border }} />
      <FeeRow label="Total" price="$25.00" centerY={606} />

      {/* ══════════ 하단 캡션 3열 ══════════ */}
      <p className="absolute" style={{ left: 185, top: 786, width: 470, fontSize: 20, lineHeight: '30px', color: C.gray }}>
        <strong style={{ fontWeight: 600, color: '#171717' }}>One API key, hundreds of models.</strong> Unified
        billing and observability across your entire AI stack, with text, image, video, and audio models.
      </p>
      <p className="absolute" style={{ left: 770, top: 786, width: 492, fontSize: 20, lineHeight: '30px', color: C.gray }}>
        <strong style={{ fontWeight: 600, color: '#171717' }}>Route on behavior, fallback anytime</strong> Automatic
        fallbacks during provider outages so your app stays up even when a model goes down.
      </p>
      <p className="absolute" style={{ left: 1340, top: 786, width: 490, fontSize: 20, lineHeight: '30px', color: C.gray }}>
        <strong style={{ fontWeight: 600, color: '#171717' }}>No markup, just fair prices</strong> Pay exactly what
        providers charge with no platform fees.
      </p>
    </div>
  );
}
