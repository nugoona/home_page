'use client';

/**
 * Vercel 디자인 소스 복제 #8 — "Managed Infrastructure / Powerful compute, zero overhead."
 * 원본(image-1783929700612) 1:1 좌표계(1953×1546)로 픽셀 복제.
 * 좌측 = 배포 커밋 카드 4장(스코어 링) / 중앙 = SSO 로그인 카드(노치 배지) / 우측 = 프레임워크→Vercel→인프라 분기 다이어그램.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

/* ───────────────────────── 스코어 링 ───────────────────────── */

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 21.5;
  const c = 2 * Math.PI * r;
  const gap = c * (1 - value / 100);
  return (
    <div className="relative" style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="-rotate-90">
        <circle cx="24" cy="24" r={r} stroke="#ebebeb" strokeWidth="5" />
        <circle
          cx="24"
          cy="24"
          r={r}
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${c - gap} ${gap}`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[19px] font-medium text-[#171717]"
        style={EN}
      >
        {value}
      </span>
    </div>
  );
}

/* ───────────────────────── 작은 아이콘들 (stroke 회색) ───────────────────────── */

const G = '#737373';

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10.5" stroke="#525252" strokeWidth="1.8" />
      <ellipse cx="13" cy="13" rx="4.6" ry="10.5" stroke="#525252" strokeWidth="1.8" />
      <path d="M2.5 13h21M4 8h18M4 18h18" stroke="#525252" strokeWidth="1.8" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4c4c4c" strokeWidth="2">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}
function AtIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#8f8f8f" strokeWidth="1.9">
      <circle cx="13" cy="13" r="4.6" />
      <path d="M23 13a10 10 0 1 0-3.6 7.7M17.6 13v1.8a3 3 0 0 0 5.4 1.8" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#8f8f8f" strokeWidth="1.9">
      <circle cx="9" cy="17" r="4.5" />
      <path d="M12.2 13.8 21 5M17.5 8.5l3 3M14.8 11.2l2.6 2.6" strokeLinecap="round" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#8f8f8f" strokeWidth="1.9">
      <path d="M3 13s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="13" cy="13" r="2.8" />
      <path d="M5 21 21 5" strokeLinecap="round" />
    </svg>
  );
}
function SunburstIcon() {
  // 12갈래 방사 스피너
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return (
      <line
        key={i}
        x1={+(13 + 5.5 * Math.cos(a)).toFixed(3)}
        y1={+(13 + 5.5 * Math.sin(a)).toFixed(3)}
        x2={+(13 + 10.5 * Math.cos(a)).toFixed(3)}
        y2={+(13 + 10.5 * Math.sin(a)).toFixed(3)}
      />
    );
  });
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" stroke="#4c4c4c" strokeWidth="2" strokeLinecap="round">
      {rays}
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="m5 17 5-4.5 4 3.5 5-4.5" strokeLinejoin="round" />
    </svg>
  );
}
function FunctionIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M14.5 7.5c-2 0-2.4 1.2-2.6 2.7l-.8 5.6c-.2 1.5-.7 2.7-2.6 2.7M9.5 11.5h5.5" strokeLinecap="round" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8" strokeLinejoin="round">
      <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z" />
      <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </svg>
  );
}
function DatabaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8">
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ───────────────────────── 프레임워크 로고 (rail) ───────────────────────── */

function SvelteMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 6.7c-1.7-2.5-5.1-3.2-7.6-1.6L7.6 7.8a4.9 4.9 0 0 0-2.2 3.3 5.2 5.2 0 0 0 .5 3.3 4.9 4.9 0 0 0-.7 1.8 5.2 5.2 0 0 0 .9 4c1.7 2.5 5.1 3.2 7.6 1.6l4.3-2.7a4.9 4.9 0 0 0 2.2-3.3 5.2 5.2 0 0 0-.5-3.3 4.9 4.9 0 0 0 .7-1.8 5.2 5.2 0 0 0-.9-4Z"
        fill="#FF3E00"
      />
      <path
        d="M10.4 19.9a3.2 3.2 0 0 1-3.4-1.3 3.1 3.1 0 0 1-.5-2.4l.1-.4.3.2c.6.5 1.3.8 2 1l.2.1v.2c0 .3.1.5.2.7a1 1 0 0 0 1 .4l.3-.1 4.3-2.7c.2-.1.4-.3.4-.6a1 1 0 0 0-.1-.7 1 1 0 0 0-1-.4l-.3.1-1.6 1a3.2 3.2 0 0 1-4.4-.9 3.1 3.1 0 0 1 .8-4.3l4.3-2.7 1-.4a3.2 3.2 0 0 1 3.4 1.3c.5.7.6 1.6.5 2.4l-.1.4-.3-.2a6 6 0 0 0-2-1l-.2-.1v-.2c0-.3-.1-.5-.2-.7a1 1 0 0 0-1-.4l-.3.1-4.3 2.7a.9.9 0 0 0-.4.6 1 1 0 0 0 .1.7 1 1 0 0 0 1 .4l.3-.1 1.6-1a3.2 3.2 0 0 1 4.4.9 3.1 3.1 0 0 1-.8 4.3l-4.3 2.7-1 .4Z"
        fill="#fff"
      />
    </svg>
  );
}
function ViteMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="cl8-vite" x1="3" y1="3" x2="18" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
      </defs>
      <path d="M22 4.5 12.6 21.4a.55.55 0 0 1-.96 0L2 4.5c-.24-.42.13-.93.6-.84l9.2 1.64a.6.6 0 0 0 .2 0l9.4-1.64c.47-.08.84.42.6.84Z" fill="url(#cl8-vite)" />
      <path d="M16.4 2.3 10 3.6a.3.3 0 0 0-.24.28l-.4 6.66c-.01.2.17.35.36.3l1.36-.31c.21-.05.4.14.36.35l-.4 1.99c-.05.22.16.4.37.34l1.13-.34c.21-.06.42.12.37.34l-.86 4.17c-.07.32.36.5.54.22l.12-.18 5.35-10.68c.11-.22-.08-.47-.32-.42l-1.4.27c-.22.04-.4-.16-.34-.37l.91-3.17c.06-.21-.12-.41-.34-.37Z" fill="#FFEA83" />
    </svg>
  );
}
function NextMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" fill="#171717" />
      <path d="M9.5 8.5h1.8l5.6 8.2V8.5h1.6v9h-1.7L11.1 9.2v8.3H9.5v-9Z" fill="#fff" />
    </svg>
  );
}
function NuxtMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" strokeLinejoin="round">
      <path d="m14.6 19.5 6.8-.02c.9 0 1.4-.97.96-1.74l-4.6-7.9a1.1 1.1 0 0 0-1.9 0l-1.26 2.14" stroke="#00DC82" strokeWidth="1.9" fill="none" />
      <path d="M11.6 8.4 10.4 6.3a1.1 1.1 0 0 0-1.9 0l-5.9 10.1c-.45.77.1 1.74.96 1.74h4.1" stroke="#00DC82" strokeWidth="1.9" fill="none" />
      <path d="m7.7 18.1 4-6.8 4 6.8h-8Z" stroke="#00DC82" strokeWidth="1.9" fill="none" />
    </svg>
  );
}
function FrameMark() {
  // 겹친 라운드 사각 프레임 로고(핑크·빨강·파랑 포인트) 근사
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="7" y="4" width="13" height="13" rx="3" stroke="#171717" strokeWidth="2" />
      <rect x="4" y="8" width="12" height="12" rx="3" stroke="#E5484D" strokeWidth="2" />
      <rect x="6.5" y="10.5" width="7" height="7" rx="1.8" fill="#F9C3D2" />
      <circle cx="18" cy="18" r="2.4" fill="#52AEFF" />
    </svg>
  );
}

/* ───────────────────────── 좌측 배포 카드 ───────────────────────── */

const DEPLOYS = [
  { slug: 'jvjb4ynna', time: '5m ago', desc: 'Dashboard perf fix', score: 95, color: '#45DEC4', left: 290, top: 436, w: 397 },
  { slug: 'gigj178vp', time: '1h ago', desc: 'Fix eslint errors on queries', score: 83, color: '#FFB939', left: 297, top: 544, w: 383 },
  { slug: 'ma71nra9', time: '1h ago', desc: 'New contact us section', score: 71, color: '#FFB939', left: 303, top: 652, w: 371 },
  { slug: 'lm20aon2', time: '3h ago', desc: 'Import new components', score: 55, color: '#E5484D', left: 309, top: 760, w: 359 },
] as const;

/* ───────────────────────── 하단 3열 텍스트 ───────────────────────── */

const COLUMNS = [
  {
    left: 291,
    title: 'Iteration, turbocharged.',
    body: "Vercel's intuitive development platform accelerates development cycles and enhances team productivity.",
    w: 390,
  },
  {
    left: 831,
    title: 'Security at every step.',
    body: 'Make it easier to manage authentication with third-party solutions like Okta.',
    w: 370,
  },
  {
    left: 1371,
    title: 'Superior performance.',
    body: 'Optimized infrastructure and CDN ensure fast load times, enhancing user engagement and satisfaction.',
    w: 400,
  },
] as const;

/* ───────────────────────── 본체 ───────────────────────── */

export default function Clone08() {
  return (
    <div className="w-full overflow-x-auto bg-[#fafafa]">
      <div className="relative" style={{ width: 1953, height: 1546, ...EN }}>
        {/* ── 세로 가이드선 4개 (전체 높이) ── */}
        {[219, 759, 1298, 1838].map((x) => (
          <div key={x} className="absolute top-0 h-full w-px bg-[#ebebeb]" style={{ left: x }} />
        ))}

        {/* ── 헤더 ── */}
        <div className="absolute left-0 right-0 flex items-center justify-center gap-3" style={{ top: 82 }}>
          <GlobeIcon />
          <span className="text-[23px] text-[#525252]">Managed Infrastructure</span>
        </div>
        <h2
          className="absolute left-0 right-0 text-center font-extrabold text-[#171717]"
          style={{ top: 134, fontSize: 66, letterSpacing: '-0.045em', lineHeight: 1.15 }}
        >
          Powerful compute, zero overhead.
        </h2>
        <p
          className="absolute text-center text-[#4d4d4d]"
          style={{ left: 280, width: 1493, top: 248, fontSize: 28, lineHeight: '54px' }}
        >
          Craft web applications that offer unparalleled performance and tailor-made user experiences to ensure your
          customers are always excited to log in.
        </p>

        {/* ── 좌측: 배포 커밋 카드 4장 ── */}
        {DEPLOYS.map((d) => (
          <div
            key={d.slug}
            className="absolute rounded-[26px] border border-[#ececec] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.04)]"
            style={{ left: d.left, top: d.top, width: d.w, height: 87 }}
          >
            <div className="absolute flex items-baseline" style={{ left: 20, top: 13 }}>
              <span className="text-[20px] text-[#a3a3a3]">site/</span>
              <span className="text-[20px] font-bold text-[#171717]">{d.slug}</span>
              <span className="ml-4 text-[18px] text-[#a3a3a3]">{d.time}</span>
            </div>
            <p className="absolute text-[20px] leading-none text-[#171717]" style={{ left: 20, top: 48 }}>
              {d.desc}
            </p>
            <div className="absolute" style={{ right: 18.5, top: 19.5 }}>
              <ScoreRing value={d.score} color={d.color} />
            </div>
          </div>
        ))}

        {/* ── 중앙: SSO 로그인 카드 ── */}
        <div
          className="absolute rounded-[18px] border border-[#ececec] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.04)]"
          style={{ left: 830, top: 430, width: 397, height: 423 }}
        >
          {/* 상단 구분선 + 자물쇠 노치 배지 (아래로 볼록) */}
          <div className="absolute left-0 right-0 h-px bg-[#ebebeb]" style={{ top: 18 }} />
          <div
            className="absolute flex items-center justify-center rounded-full border border-[#f0f0f0] bg-white"
            style={{ left: 198.5 - 37, top: 36 - 37, width: 74, height: 74 }}
          >
            <LockIcon />
          </div>
          {/* 상단 밴드 위쪽을 흰색으로 덮어 배지 위 절반의 테두리를 감춤 */}
          <div className="absolute left-0 right-0 rounded-t-[18px] bg-white" style={{ top: 0, height: 18 }} />

          {/* Email 입력 */}
          <div
            className="absolute flex items-center rounded-[14px] border border-[#e6e6e6]"
            style={{ left: 38, top: 98, width: 321, height: 59, paddingLeft: 19 }}
          >
            <AtIcon />
            <span className="ml-4 text-[23px] text-[#a3a3a3]">Email</span>
          </div>
          {/* Key 입력 */}
          <div
            className="absolute flex items-center rounded-[14px] border border-[#e6e6e6]"
            style={{ left: 38, top: 182, width: 321, height: 59, paddingLeft: 19, paddingRight: 18 }}
          >
            <KeyIcon />
            <span className="ml-4 text-[23px] text-[#a3a3a3]">Key</span>
            <span className="ml-auto">
              <EyeOffIcon />
            </span>
          </div>

          {/* SAML SSO + Log In */}
          <span className="absolute text-[23px] text-[#171717]" style={{ left: 38, top: 283 }}>
            With SAML SSO
          </span>
          <button
            type="button"
            className="absolute flex items-center justify-center rounded-full border border-[#e6e6e6] bg-white text-[23px] text-[#171717]"
            style={{ left: 242, top: 268, width: 117, height: 56 }}
          >
            Log In
          </button>

          {/* 하단 구분선 + 스피너 노치 배지 (위로 볼록) */}
          <div className="absolute left-0 right-0 h-px bg-[#ebebeb]" style={{ top: 405 }} />
          <div
            className="absolute flex items-center justify-center rounded-full border border-[#f0f0f0] bg-white"
            style={{ left: 198.5 - 37, top: 385 - 37, width: 74, height: 74 }}
          >
            <SunburstIcon />
          </div>
          {/* 하단 밴드 아래쪽을 흰색으로 덮어 배지 아래 절반의 테두리를 감춤 */}
          <div className="absolute left-0 right-0 rounded-b-[18px] bg-white" style={{ top: 405 + 1, height: 423 - 406 }} />
        </div>

        {/* ── 우측: 분기 다이어그램 ── */}
        {/* 커넥터 SVG (요소 뒤) */}
        <svg
          viewBox="0 0 1953 1546"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
        >
          {/* rail → 노드 (회색 수평선) */}
          <path d="M1420 641.5 H1493" stroke="#848484" strokeWidth="3" />
          {/* 노드 → 4개 인프라 카드 */}
          <path d="M1588 621 C1640 621, 1645 502.5, 1711 502.5" stroke="#52AEFF" strokeWidth="4.5" />
          <path d="M1588 637 C1645 637, 1650 595.5, 1711 595.5" stroke="#E5484D" strokeWidth="4.5" />
          <path d="M1588 650 C1640 650, 1645 689.5, 1711 689.5" stroke="#FFB939" strokeWidth="4.5" />
          <path d="M1588 664 C1640 664, 1645 782.5, 1711 782.5" stroke="#45DEC4" strokeWidth="4.5" />
        </svg>

        {/* 프레임워크 rail (캡슐, 5칸) */}
        <div
          className="absolute rounded-full border border-[#e6e6e6] bg-white"
          style={{ left: 1371, top: 504, width: 49, height: 275 }}
        >
          {[55, 110, 165, 220].map((y) => (
            <div key={y} className="absolute left-0 right-0 h-px bg-[#e6e6e6]" style={{ top: y }} />
          ))}
          {[
            { top: 0, node: <SvelteMark /> },
            { top: 55, node: <ViteMark /> },
            { top: 110, node: <NextMark /> },
            { top: 165, node: <NuxtMark /> },
            { top: 220, node: <FrameMark /> },
          ].map((r, i) => (
            <div key={i} className="absolute left-0 flex w-full items-center justify-center" style={{ top: r.top, height: 55 }}>
              {r.node}
            </div>
          ))}
        </div>

        {/* 중앙 Vercel 노드 */}
        <div
          className="absolute flex items-center justify-center rounded-[26px] border border-[#e6e6e6] bg-white"
          style={{ left: 1493, top: 594, width: 95, height: 95 }}
        >
          <span className="flex items-center justify-center rounded-full bg-[#171717]" style={{ width: 48, height: 48 }}>
            <svg width="20" height="18" viewBox="0 0 20 18" fill="#fff">
              <path d="M10 0l10 18H0L10 0Z" />
            </svg>
          </span>
        </div>

        {/* 인프라 카드 4장 */}
        {[
          { top: 477, node: <ImageIcon /> },
          { top: 570.5, node: <FunctionIcon /> },
          { top: 664, node: <LayersIcon /> },
          { top: 757, node: <DatabaseIcon /> },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center rounded-[14px] border border-[#ebebeb] bg-white"
            style={{ left: 1711, top: c.top, width: 49, height: 51 }}
          >
            {c.node}
          </div>
        ))}

        {/* ── 하단 3열 텍스트 ── */}
        {COLUMNS.map((col) => (
          <div key={col.title} className="absolute" style={{ left: col.left, top: 936, width: col.w }}>
            <h3 className="font-bold text-[#171717]" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>
              {col.title}
            </h3>
            <p className="text-[#525252]" style={{ marginTop: 40, fontSize: 21, lineHeight: '36px' }}>
              {col.body}
            </p>
          </div>
        ))}

        {/* ── 인용 + neo ── */}
        <span className="absolute font-bold text-[#171717]" style={{ left: 263, top: 1284, fontSize: 26 }}>
          &quot;
        </span>
        <p
          className="absolute text-[#26282b]"
          style={{ left: 291, top: 1292, width: 1050, fontSize: 28, lineHeight: '53.5px' }}
        >
          Our core business is banking and financial services so now we are able to invest our engineering resources in
          building features for those users instead of building infrastructure.{' '}
          <span className="font-bold" style={{ fontSize: 26 }}>
            &quot;
          </span>
        </p>
        <div className="absolute text-right" style={{ right: 1953 - 1668, top: 1326, width: 300 }}>
          <p className="text-[21px] text-[#171717]">Principal Engineer</p>
          <p
            className="font-bold leading-none text-[#0a0a0a]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 54, marginTop: 8, letterSpacing: '-0.02em' }}
          >
            neo
          </p>
        </div>
        <span
          className="absolute flex items-center justify-center rounded-full border border-[#e5e5e5] bg-white"
          style={{ left: 1735 - 30, top: 1365 - 30, width: 60, height: 60 }}
        >
          <ArrowRightIcon />
        </span>
      </div>
    </div>
  );
}
