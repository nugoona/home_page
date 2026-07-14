'use client';

/**
 * Clone07 — Vercel "Security by default." 섹션 1:1 복제 (디자인 학습용)
 * 원본: vercel_image/image-1783929696202.png (1975×1201)
 * 좌표계 = 원본 이미지 px 그대로 (absolute 배치, 축소 금지)
 *
 * 실측값:
 * - 배경 #fafafa / 라이트 그리드 라인 #ebebeb (x=184·724·1263·1803, 수평 y=53)
 * - 다크 패널 x185 y417 1618×676 #0a0a0a, 내부 디바이더 #292929 (x=724·1263, y=705·827), 하단 보더 #292929
 * - 인용 28px / 행간 53.7px / #171717, 시작 x=257
 * - 헤딩 64px 600 #ededed (캡하이트 46px 실측), 카드 제목 32px 600 #ededed
 * - 화살표 원 48px, 보더 #2e2e2e, 중심 y=766
 * - 레이블·설명 20px #a1a1a1, 설명 행간 30px
 */

const GRID_X = [184, 724, 1263, 1803]; // 수직 그리드 라인
const LIGHT_LINE = '#ebebeb';
const DARK_BG = '#0a0a0a';
const DARK_LINE = '#292929';
const TXT_LIGHT = '#ededed';
const TXT_GRAY = '#a1a1a1';
const TXT_DARK = '#171717';

/* ---------- 아이콘 (24×24, stroke #a1a1a1) ---------- */

function IconShieldGlobe() {
  // 방패(좌측·상단만, 우하단은 지구본에 잘림) + 우하단 지구본
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18.5 6.5L11.5 4L4.5 6.5V12.5C4.5 16.2 7 18.8 9.2 20.1"
        stroke={TXT_GRAY}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 4L11.5 2.8" stroke={TXT_GRAY} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.2" cy="16.2" r="5.3" stroke={TXT_GRAY} strokeWidth="1.8" />
      <ellipse cx="16.2" cy="16.2" rx="2.4" ry="5.3" stroke={TXT_GRAY} strokeWidth="1.5" />
      <path d="M10.9 14.4H21.5M10.9 18H21.5" stroke={TXT_GRAY} strokeWidth="1.5" />
    </svg>
  );
}

function IconTableCheck() {
  // 상단 행 3칸 + 좌측 열 격자 + 우하단 체크 배지
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6.5C4 5.4 4.9 4.5 6 4.5H18C19.1 4.5 20 5.4 20 6.5V9.5H4V6.5Z"
        stroke={TXT_GRAY}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 4.5V9.5M14.5 4.5V9.5" stroke={TXT_GRAY} strokeWidth="1.8" />
      <path
        d="M4 9.5V17.5C4 18.6 4.9 19.5 6 19.5H8.5M4 14.5H9.5M9.5 9.5V19"
        stroke={TXT_GRAY}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="16.5" r="5.5" fill={TXT_GRAY} />
      <path
        d="M14 16.8L15.8 18.6L19.2 14.6"
        stroke={DARK_BG}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBot() {
  // 안테나 + 아치형 머리 + 두 눈 + 양옆 귀
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="4" r="1.6" fill={TXT_GRAY} />
      <path d="M12 5.6V8.2" stroke={TXT_GRAY} strokeWidth="1.6" />
      <path
        d="M5.5 20V14.5C5.5 11 8.4 8.2 12 8.2C15.6 8.2 18.5 11 18.5 14.5V20H5.5Z"
        stroke={TXT_GRAY}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="9.4" cy="14.6" r="1.7" fill={TXT_GRAY} />
      <circle cx="14.6" cy="14.6" r="1.7" fill={TXT_GRAY} />
      <path d="M3 14.5V17.5M21 14.5V17.5" stroke={TXT_GRAY} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowCircle({ cx }: { cx: number }) {
  // 원 중심 y=766(절대) → 패널 상대 349, 지름 48
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - 185 - 24,
        top: 766 - 417 - 24,
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid #2e2e2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.5 12H19M13 5.5L19.5 12L13 18.5"
          stroke={TXT_LIGHT}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ---------- 카드 데이터 ---------- */

const CARDS = [
  {
    title: 'Global Defense',
    colLeft: 0, // 패널 상대 x
    arrowCx: 627,
    icon: <IconShieldGlobe />,
    label: 'Platform Firewall',
    desc: (
      <>
        Proactive defense against large-scale L3,
        <br />
        L4, and L7 attacks.
      </>
    ),
  },
  {
    title: 'Granular Control',
    colLeft: 539,
    arrowCx: 1166,
    icon: <IconTableCheck />,
    label: 'Web Application Firewall',
    desc: (
      <>
        Fine-tune firewall access, with logic
        <br />
        tailored to your needs.
      </>
    ),
  },
  {
    title: 'Intelligent Filtering',
    colLeft: 1078,
    arrowCx: 1705,
    icon: <IconBot />,
    label: 'Bot Management',
    desc: (
      <>
        Multi-layered protection from malicious bot
        <br />
        activity.
      </>
    ),
  },
];

/* ---------- 메인 ---------- */

export default function Clone07() {
  return (
    <div
      style={{
        position: 'relative',
        width: 1975,
        height: 1201,
        background: '#fafafa',
        overflow: 'hidden',
        fontFamily: 'var(--font-en)',
      }}
    >
      {/* 수직 그리드 라인 (전체 높이) */}
      {GRID_X.map((x) => (
        <div
          key={x}
          style={{ position: 'absolute', left: x, top: 0, width: 1, height: 1201, background: LIGHT_LINE }}
        />
      ))}
      {/* 상단 수평 라인 y=53 */}
      <div style={{ position: 'absolute', left: 184, top: 53, width: 1620, height: 1, background: LIGHT_LINE }} />

      {/* ===== 인용 섹션 (y 54~416) ===== */}
      {/* 여는 따옴표 (x≈231, y≈127) */}
      <span
        style={{
          position: 'absolute',
          left: 229,
          top: 113,
          fontSize: 30,
          fontWeight: 700,
          color: TXT_DARK,
          lineHeight: 1,
        }}
      >
        &quot;
      </span>
      {/* 인용 본문: 4줄 고정 줄바꿈, 28px / 행간 53.7px */}
      <div
        style={{
          position: 'absolute',
          left: 257,
          top: 126,
          width: 960,
          fontSize: 28,
          lineHeight: '53.7px',
          fontWeight: 400,
          color: TXT_DARK,
          letterSpacing: '0.01em',
        }}
      >
        In the age of AI, getting your product into the market needs to be
        <br />
        incredibly fast. We were able to launch Director.ai quickly thanks to
        <br />
        Vercel&apos;s primitives like functions, Fluid Compute, AI SDK, and
        <br />
        Observability. Launch day was smooth thanks to Vercel.{' '}
        <span style={{ position: 'relative', top: -9, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>&quot;</span>
      </div>
      {/* 인용자 (우측 정렬, 오른쪽 끝 x=1729) */}
      <div
        style={{
          position: 'absolute',
          right: 1975 - 1729,
          top: 198,
          fontSize: 24,
          fontWeight: 400,
          color: TXT_DARK,
          textAlign: 'right',
        }}
      >
        Paul Klein IV, CEO
      </div>
      {/* Browserbase 로고 (사각형 x1564 y242 26×26 + 텍스트, 오른쪽 끝 x=1729) */}
      <div
        style={{
          position: 'absolute',
          right: 1975 - 1729,
          top: 242,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: '#000',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 800, lineHeight: 1 }}>B</span>
        </div>
        <span style={{ fontSize: 19, fontWeight: 600, color: '#000', letterSpacing: '0.005em' }}>Browserbase</span>
      </div>

      {/* ===== 다크 패널 (x185 y417, 1618×676) ===== */}
      <div
        style={{
          position: 'absolute',
          left: 185,
          top: 417,
          width: 1618,
          height: 676,
          background: DARK_BG,
          borderBottom: `1px solid ${DARK_LINE}`,
          boxSizing: 'border-box',
        }}
      >
        {/* 내부 수직 디바이더 (절대 x=724·1263 → 상대 539·1078) */}
        {[539, 1078].map((x) => (
          <div key={x} style={{ position: 'absolute', left: x, top: 0, width: 1, height: '100%', background: DARK_LINE }} />
        ))}
        {/* 내부 수평 디바이더 (절대 y=705·827 → 상대 288·410) */}
        {[288, 410].map((y) => (
          <div key={y} style={{ position: 'absolute', left: 0, top: y, width: '100%', height: 1, background: DARK_LINE }} />
        ))}

        {/* 헤딩 (캡 상단 절대 y=502) */}
        <h2
          style={{
            position: 'absolute',
            left: 72,
            top: 72,
            margin: 0,
            fontSize: 64,
            lineHeight: '73px',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            color: TXT_LIGHT,
          }}
        >
          Security by
          <br />
          default.
        </h2>

        {/* 카드 3개 */}
        {CARDS.map((c) => (
          <div key={c.title}>
            {/* 제목 (중심 y=766 절대 → 상대 349) */}
            <div
              style={{
                position: 'absolute',
                left: c.colLeft + 72,
                top: 333,
                fontSize: 32,
                lineHeight: '32px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: TXT_LIGHT,
              }}
            >
              {c.title}
            </div>
            <ArrowCircle cx={c.arrowCx} />
            {/* 아이콘 (절대 y906 → 상대 489) */}
            <div style={{ position: 'absolute', left: c.colLeft + 72, top: 489, width: 24, height: 24 }}>{c.icon}</div>
            {/* 레이블 (아이콘 우측, 텍스트 시작 절대 x+108) */}
            <div
              style={{
                position: 'absolute',
                left: c.colLeft + 108,
                top: 489,
                fontSize: 20,
                lineHeight: '24px',
                fontWeight: 400,
                color: TXT_GRAY,
              }}
            >
              {c.label}
            </div>
            {/* 설명 2줄 (절대 y961 → 상대 544, 행간 30px) */}
            <div
              style={{
                position: 'absolute',
                left: c.colLeft + 72,
                top: 544,
                fontSize: 20,
                lineHeight: '30px',
                fontWeight: 400,
                color: TXT_GRAY,
              }}
            >
              {c.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
