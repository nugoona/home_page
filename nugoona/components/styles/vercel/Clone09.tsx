'use client';

/**
 * Vercel 디자인 소스 복제 #9 — 2×2 기능 그리드(Scale fast / Go global / Experiment easily / Stay secure).
 * 원본(image-1783929704777) 1:1 좌표계(1905×1630)로 픽셀 복제.
 * 실측: bg #FAFAFA / 경계선 #EBEBEB(x=185·995·1804, y=780) / 십자 #A8A8A8 /
 * 텍스트 #171717·#4D4D4D / 차트 #52AEFF·#45DEC4 / 보라 #BF89EC / 빨강 #E5484D.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const MONO = { fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace" } as const;

/* ── eyebrow 아이콘 (20px stroke) ── */
function IconScale() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4d4d4d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4d4d4d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4d4d4d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4d4d4d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconLock({ size = 16, color = '#171717' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function IconMonitor() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function IconTablet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <line x1="11" y1="17.5" x2="13" y2="17.5" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </svg>
  );
}

/* ── 공통 조각 ── */
function Eyebrow({ left, top, icon, label }: { left: number; top: number; icon: React.ReactNode; label: string }) {
  return (
    <div className="absolute flex items-center gap-[15px]" style={{ left, top }}>
      {icon}
      <span className="text-[18px] leading-none text-[#4d4d4d]" style={EN}>{label}</span>
    </div>
  );
}

function Headline({ left, top, width, dark, gray }: { left: number; top: number; width: number; dark: string; gray: string }) {
  return (
    <p
      className="absolute"
      style={{ ...EN, left, top, width, fontSize: 30, lineHeight: '48px', letterSpacing: '-0.4px', fontWeight: 600 }}
    >
      <span style={{ color: '#171717' }}>{dark}</span>{' '}
      <span style={{ color: '#4d4d4d' }}>{gray}</span>
    </p>
  );
}

function GlobeNode({ cx, cy }: { cx: number; cy: number }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full bg-white"
      style={{ left: cx - 15, top: cy - 15, width: 30, height: 30, boxShadow: '0 1px 4px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.02)' }}
    >
      <svg width="11" height="10" viewBox="0 0 11 10"><polygon points="5.5,0 11,10 0,10" fill="#171717" /></svg>
    </div>
  );
}

function DeviceCircle({ cx, cy, children }: { cx: number; cy: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full bg-white"
      style={{ left: cx - 29, top: cy - 29, width: 58, height: 58, boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.03)' }}
    >
      {children}
    </div>
  );
}

function Dots({ x, y, gap = 15, r = 4.5, color = '#d9d9d9' }: { x: number; y: number; gap?: number; r?: number; color?: string }) {
  return (
    <div className="absolute flex" style={{ left: x, top: y - r, columnGap: gap - r * 2 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="rounded-full" style={{ width: r * 2, height: r * 2, backgroundColor: color }} />
      ))}
    </div>
  );
}

/* ── Q3 브라우저 창 ── */
function BrowserCard({
  left, top, lines, badge, badgeBg, pills,
}: {
  left: number; top: number; lines: string[]; badge: string; badgeBg: string;
  pills: { x: number; y: number; w: number; h: number; kind: 'fill' | 'outline' }[];
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-[12px] bg-white"
      style={{ left, top, width: 302, height: 233, border: '1px solid #ebebeb' }}
    >
      {/* 상단 바 */}
      <div className="relative h-[48px]" style={{ borderBottom: '1px solid #ebebeb' }}>
        <Dots x={20} y={24} gap={17} />
        <div className="absolute inset-0 flex items-center justify-center gap-[8px]">
          <IconLock size={13} />
          <span className="text-[15px] tracking-[1px] text-[#171717]" style={MONO}>/signup</span>
        </div>
      </div>
      {/* 격자 본문 */}
      <div
        className="absolute"
        style={{
          left: 18, right: 18, top: 52, bottom: 18,
          backgroundImage:
            'linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px)',
          backgroundSize: '37px 37px',
        }}
      />
      {/* 아웃라인 텍스트 */}
      <div
        className="absolute left-0 right-0 text-center font-bold"
        style={{ ...EN, top: 72, fontSize: 29, lineHeight: '31px', color: '#fcfcfc', WebkitTextStroke: '1px #d4d4d4' }}
      >
        {lines.map((l) => <div key={l}>{l}</div>)}
      </div>
      {/* pill 목업 */}
      {pills.map((p, i) =>
        p.kind === 'fill' ? (
          <div key={i} className="absolute rounded-full" style={{ left: p.x, top: p.y, width: p.w, height: p.h, backgroundColor: '#dedede' }} />
        ) : (
          <div key={i} className="absolute rounded-full bg-white" style={{ left: p.x, top: p.y, width: p.w, height: p.h, border: '1px solid #e4e4e4' }} />
        ),
      )}
      {/* Segment 배지 */}
      <div
        className="absolute bottom-0 right-0 flex items-center justify-center"
        style={{ ...EN, width: 130, height: 39, backgroundColor: badgeBg, borderTopLeftRadius: 8, fontSize: 17, color: '#ffffff', fontWeight: 500 }}
      >
        {badge}
      </div>
    </div>
  );
}

/* ── 차트 데이터 (Q1) ── */
const BLUE_PTS = '255,656 285,652 312,648 340,634 368,648 398,641 430,622 462,606 500,590 540,586 580,584 620,574 655,568 691,562 722,540 748,514 778,514 800,489 838,488 862,462 886,430 920,429';
const GREEN_PTS = '255,682 290,674 322,676 355,668 388,672 420,658 450,668 478,660 505,672 532,655 560,668 588,652 614,662 640,672 668,650 691,633 720,650 748,652 775,652 800,637 825,610 850,600 875,600 895,580 920,578';
const AXIS = [
  { label: '7,000', y: 430 }, { label: '6,000', y: 474 }, { label: '5,000', y: 518 },
  { label: '4,000', y: 562 }, { label: '3,000', y: 607 }, { label: '2,000', y: 651 }, { label: '1,000', y: 695 },
];

export default function Clone09() {
  return (
    <div className="w-full overflow-x-auto" style={{ backgroundColor: '#fafafa' }}>
      <div className="relative" style={{ ...EN, width: 1905, height: 1630 }}>
        {/* ── 그리드 경계선 ── */}
        {[185, 995, 1804].map((x) => (
          <div key={x} className="absolute" style={{ left: x, top: 0, width: 1, height: 1630, backgroundColor: '#ebebeb' }} />
        ))}
        <div className="absolute" style={{ left: 185, top: 780, width: 1619, height: 1, backgroundColor: '#ebebeb' }} />
        {/* 교차점 십자 */}
        <div className="absolute" style={{ left: 984, top: 779.5, width: 22, height: 2, backgroundColor: '#a8a8a8' }} />
        <div className="absolute" style={{ left: 994, top: 769.5, width: 2, height: 22, backgroundColor: '#a8a8a8' }} />

        {/* ── 전역 SVG (차트·글로브·분기·보안 곡선) ── */}
        <svg viewBox="0 0 1905 1630" className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            {/* 차트 라인 좌측 fade */}
            <linearGradient id="c9-blue" x1="255" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#52aeff" stopOpacity="0" />
              <stop offset="1" stopColor="#52aeff" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="c9-green" x1="255" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#45dec4" stopOpacity="0" />
              <stop offset="1" stopColor="#45dec4" stopOpacity="1" />
            </linearGradient>
            {/* 글로브 wireframe 하단 fade */}
            <linearGradient id="c9-wire" x1="0" y1="380" x2="0" y2="770" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e3e3e3" stopOpacity="1" />
              <stop offset="0.75" stopColor="#e3e3e3" stopOpacity="0.85" />
              <stop offset="1" stopColor="#e3e3e3" stopOpacity="0.25" />
            </linearGradient>
            {/* 글로브 파란 경로 — 위쪽 끝 fade */}
            <linearGradient id="c9-route" x1="0" y1="540" x2="0" y2="492" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#52aeff" stopOpacity="1" />
              <stop offset="0.7" stopColor="#52aeff" stopOpacity="1" />
              <stop offset="1" stopColor="#52aeff" stopOpacity="0" />
            </linearGradient>
            {/* Q3 분기: 보라→빨강 / 빨강→청록 전이 */}
            <linearGradient id="c9-pr" x1="440" y1="0" x2="562" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#bf89ec" />
              <stop offset="0.8" stopColor="#bf89ec" />
              <stop offset="1" stopColor="#e5484d" />
            </linearGradient>
            <linearGradient id="c9-rg" x1="616" y1="0" x2="740" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#e5484d" />
              <stop offset="0.2" stopColor="#45dec4" />
              <stop offset="1" stopColor="#45dec4" />
            </linearGradient>
          </defs>

          {/* ═══ Q1 차트 ═══ */}
          {AXIS.map((a) => (
            <line key={a.y} x1="318" y1={a.y} x2="920" y2={a.y} stroke="#e6e6e6" strokeWidth="1" />
          ))}
          {/* 커서 세로선 */}
          <line x1="691" y1="424" x2="691" y2="700" stroke="#e5e5e5" strokeWidth="2" />
          <polyline points={GREEN_PTS} stroke="url(#c9-green)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={BLUE_PTS} stroke="url(#c9-blue)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="691" cy="562" r="5" fill="#52aeff" stroke="#fafafa" strokeWidth="2.5" />
          <circle cx="691" cy="633" r="5" fill="#45dec4" stroke="#fafafa" strokeWidth="2.5" />

          {/* ═══ Q2 글로브 wireframe (중심 1400,705 / R 330) ═══ */}
          <g stroke="url(#c9-wire)" strokeWidth="1">
            {/* 외곽 반원 */}
            <path d="M 1070 705 A 330 330 0 0 1 1730 705" />
            {/* 경도선 (중앙 수직 + 좌우 3쌍) */}
            <line x1="1400" y1="375" x2="1400" y2="760" />
            <path d="M 1400 375 A 110 330 0 0 1 1510 705 A 110 330 0 0 1 1400 760" opacity="0" />
            <path d="M 1400 375 A 110 330 0 0 1 1510 705" />
            <path d="M 1400 375 A 110 330 0 0 0 1290 705" />
            <path d="M 1400 375 A 215 330 0 0 1 1615 705" />
            <path d="M 1400 375 A 215 330 0 0 0 1185 705" />
            <path d="M 1400 375 A 295 330 0 0 1 1695 705" />
            <path d="M 1400 375 A 295 330 0 0 0 1105 705" />
            {/* 위도선 3개 (아래 볼록) */}
            <path d="M 1121 516 Q 1400 564 1679 516" />
            <path d="M 1078 596 Q 1400 648 1722 596" />
            <path d="M 1071 682 Q 1400 733 1729 682" />
          </g>
          {/* 파란 배포 경로 */}
          <path d="M 1182 540 L 1224 540 Q 1237 540 1241 527 L 1248 494" stroke="url(#c9-route)" strokeWidth="2.5" strokeLinecap="round" />

          {/* ═══ Q3 분기 다이어그램 ═══ */}
          {/* 보라 브랜치 (좌) + 화살촉 */}
          <path d="M 440 1244 L 440 1170 Q 440 1148 462 1148 L 562 1148" stroke="url(#c9-pr)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 431 1237 L 440 1249 L 449 1237" stroke="#bf89ec" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 빨강 지그재그(스프링) */}
          <path d="M 562 1148 l 5 0 l 5 -11 l 9 22 l 9 -22 l 9 22 l 9 -22 l 5 11 l 5 0" stroke="#e5484d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 청록 브랜치 (우) + 화살촉 */}
          <path d="M 618 1148 L 718 1148 Q 740 1148 740 1170 L 740 1247" stroke="url(#c9-rg)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 731 1240 L 740 1252 L 749 1240" stroke="#45dec4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* ═══ Q4 보안 다이어그램 연결선 ═══ */}
          {/* 점선(터미널→) + 실선(→검은 원) */}
          <line x1="1214" y1="1358" x2="1300" y2="1358" stroke="#c6c6c6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0.1 9" />
          <line x1="1300" y1="1358" x2="1360" y2="1358" stroke="#8f8f8f" strokeWidth="2" />
          {/* 빨강: 검은 원 → 자물쇠1 / 자물쇠1 → 모니터 */}
          <path d="M 1408 1347 C 1445 1322, 1462 1305, 1489 1295" stroke="#e5484d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 1554 1261 C 1592 1252, 1638 1250, 1671 1253" stroke="#e5484d" strokeWidth="2.5" strokeLinecap="round" />
          {/* 청록: 수평 */}
          <line x1="1416" y1="1361" x2="1489" y2="1361" stroke="#45dec4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="1554" y1="1361" x2="1671" y2="1361" stroke="#45dec4" strokeWidth="2.5" strokeLinecap="round" />
          {/* 파랑: 검은 원 → 자물쇠3 / 자물쇠3 → 폰 */}
          <path d="M 1408 1375 C 1445 1400, 1462 1418, 1489 1428" stroke="#52aeff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 1554 1459 C 1592 1467, 1636 1469, 1671 1467" stroke="#52aeff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* ═══════════ Q1 — Scale fast ═══════════ */}
        <Eyebrow left={259} top={58} icon={<IconScale />} label="Scale fast" />
        <Headline
          left={259} top={112} width={655}
          dark="Go from zero to beta users in days."
          gray="Scale and manage powerful workloads without the infrastructure overhead."
        />
        {/* y축 라벨 (오른쪽 정렬) */}
        {AXIS.map((a) => (
          <div key={a.label} className="absolute text-right text-[14px] leading-none text-[#7b7b7b]" style={{ left: 245, top: a.y - 7, width: 60 }}>
            {a.label}
          </div>
        ))}
        {/* 툴팁 카드 */}
        <div
          className="absolute rounded-[14px] bg-white"
          style={{ left: 430, top: 528, width: 238, height: 84, border: '1px solid #ebebeb', boxShadow: '0 8px 24px rgba(0,0,0,0.07)' }}
        >
          {[
            { label: 'Views', value: '4031', pct: '+47%', bg: '#ebf5ff', fg: '#0068d6', top: 12 },
            { label: 'Clicks', value: '2335', pct: '+53%', bg: '#d4f7f0', fg: '#067a6e', top: 47 },
          ].map((r) => (
            <div key={r.label} className="absolute flex items-center" style={{ left: 15, top: r.top, height: 26 }}>
              <span className="w-[82px] text-[17px] text-[#171717]">{r.label}</span>
              <span className="w-[64px] text-[17px] font-bold text-[#171717]">{r.value}</span>
              <span
                className="flex items-center justify-center rounded-full text-[13px] font-medium"
                style={{ width: 60, height: 26, backgroundColor: r.bg, color: r.fg }}
              >
                {r.pct}
              </span>
            </div>
          ))}
        </div>

        {/* ═══════════ Q2 — Go global ═══════════ */}
        <Eyebrow left={1069} top={58} icon={<IconGlobe />} label="Go global" />
        <Headline
          left={1069} top={112} width={575}
          dark="Scale effortlessly."
          gray="Edge network for lightning fast content delivery and serverless scaling without manual intervention."
        />
        {/* 엣지 노드 7개 */}
        {[[1399, 458], [1164, 540], [1311, 540], [1567, 541], [1497, 624], [1298, 706], [1671, 706]].map(([x, y]) => (
          <GlobeNode key={`${x}-${y}`} cx={x} cy={y} />
        ))}

        {/* ═══════════ Q3 — Experiment easily ═══════════ */}
        <Eyebrow left={259} top={860} icon={<IconFlag />} label="Experiment easily" />
        <Headline
          left={259} top={914} width={655}
          dark="Iterate to greatness."
          gray="Explore platform possibilities like experimentation with A/B tests and support for feature flag tooling."
        />
        <BrowserCard
          left={258} top={1266}
          lines={['Create account']}
          badge="Segment A" badgeBg="#bf89ec"
          pills={[
            { x: 58, y: 156, w: 63, h: 17, kind: 'fill' },
            { x: 188, y: 150, w: 62, h: 18, kind: 'outline' },
          ]}
        />
        <BrowserCard
          left={621} top={1266}
          lines={['Join the', 'best teams']}
          badge="Segment B" badgeBg="#45dec5"
          pills={[
            { x: 107, y: 142, w: 65, h: 23, kind: 'fill' },
            { x: 195, y: 142, w: 65, h: 23, kind: 'outline' },
          ]}
        />

        {/* ═══════════ Q4 — Stay secure ═══════════ */}
        <Eyebrow left={1069} top={860} icon={<IconShield />} label="Stay secure" />
        <Headline
          left={1069} top={914} width={655}
          dark="Comprehensive and robust."
          gray="Scalable DDoS Mitigation and Firewall protection at every edge location, so your app stays protected without adding latency."
        />
        {/* 터미널 카드 */}
        <div className="absolute rounded-[12px] bg-white" style={{ left: 1070, top: 1313, width: 141, height: 100, border: '1px solid #ebebeb' }}>
          <Dots x={16} y={21} gap={16} />
          <div className="absolute flex items-center gap-[7px]" style={{ left: 16, top: 54 }}>
            <svg width="11" height="10" viewBox="0 0 11 10"><polygon points="5.5,0 11,10 0,10" fill="#171717" /></svg>
            <span className="text-[16px] leading-none text-[#171717]" style={MONO}>~ push</span>
          </div>
        </div>
        {/* 중앙 카드 + 자물쇠 스트립 */}
        <div className="absolute rounded-[16px]" style={{ left: 1283, top: 1225, width: 270, height: 272, border: '1px solid #ebebeb' }}>
          <div className="absolute" style={{ left: 206, top: 0, width: 1, height: 270, backgroundColor: '#ebebeb' }} />
          <div className="absolute" style={{ left: 206, top: 90, width: 64, height: 1, backgroundColor: '#ebebeb' }} />
          <div className="absolute" style={{ left: 206, top: 181, width: 64, height: 1, backgroundColor: '#ebebeb' }} />
          {[43, 135, 228].map((y) => (
            <div key={y} className="absolute" style={{ left: 230, top: y - 8 }}>
              <IconLock size={16} />
            </div>
          ))}
        </div>
        {/* 검은 원 + 삼각형 */}
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{ left: 1386 - 29, top: 1361 - 29, width: 58, height: 58, backgroundColor: '#171717' }}
        >
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path d="M11 2.5 L20 17.5 L2 17.5 Z" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        {/* 디바이스 원 3개 */}
        <DeviceCircle cx={1701} cy={1253}><IconMonitor /></DeviceCircle>
        <DeviceCircle cx={1701} cy={1361}><IconTablet /></DeviceCircle>
        <DeviceCircle cx={1701} cy={1468}><IconPhone /></DeviceCircle>
      </div>
    </div>
  );
}
