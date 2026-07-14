'use client';

/**
 * Vercel 디자인 소스 복제 #4 — "Avoid unintended access → Vercel Sandbox 터미널" 격리 데모.
 * 원본(image-1783929634701.webp) 1:1 좌표계(2000×604)로 픽셀 복제.
 * 구성: 좌측 카피 3줄 / 중앙 스파클 아이콘 카드 / 주황 커넥터(양끝 포트 원) / 우측 터미널 카드.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace',
} as const;

/** 4각 스파클(오목 변) — cx,cy 중심 / r 반지름 */
function Spark({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const q = r * 0.16; // 오목 제어점 (중심 쪽으로 깊게)
  const d = [
    `M ${cx} ${cy - r}`,
    `C ${cx + q} ${cy - q * 1.6}, ${cx + q * 1.6} ${cy - q}, ${cx + r} ${cy}`,
    `C ${cx + q * 1.6} ${cy + q}, ${cx + q} ${cy + q * 1.6}, ${cx} ${cy + r}`,
    `C ${cx - q} ${cy + q * 1.6}, ${cx - q * 1.6} ${cy + q}, ${cx - r} ${cy}`,
    `C ${cx - q * 1.6} ${cy - q}, ${cx - q} ${cy - q * 1.6}, ${cx} ${cy - r}`,
    'Z',
  ].join(' ');
  return <path d={d} fill="#ffb224" />;
}

export default function Clone04() {
  return (
    <div className="w-full overflow-x-auto" style={{ backgroundColor: '#fafafa' }}>
      <div className="relative" style={{ width: 2000, height: 604 }}>
        {/* ── 좌측 카피 (줄바꿈 고정) ── */}
        <p
          className="absolute"
          style={{
            ...EN,
            left: 133,
            top: 227,
            fontSize: 27,
            lineHeight: '38px',
            letterSpacing: '-0.01em',
            color: '#555555',
          }}
        >
          <span style={{ color: '#171717', fontWeight: 600 }}>Avoid unintended access</span> to your
          <br />
          environment variables, databases,
          <br />
          and other secure environments.
        </p>

        {/* ── 스파클 아이콘 카드 ── */}
        <div
          className="absolute rounded-[16px] border border-[#ececec] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
          style={{ left: 863, top: 245, width: 76, height: 76 }}
        >
          <svg viewBox="0 0 76 76" className="absolute inset-0 h-full w-full" fill="none">
            <Spark cx={39.5} cy={43.5} r={10} />
            <Spark cx={28} cy={28} r={6.5} />
            <Spark cx={48} cy={27.5} r={4.5} />
          </svg>
        </div>

        {/* ── 터미널 카드 ── */}
        <div
          className="absolute rounded-[16px] border border-[#e5e5e5] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
          style={{ left: 1012, top: 108, width: 878, height: 350 }}
        >
          {/* 헤더 */}
          <div
            className="relative flex items-center justify-center"
            style={{ height: 46, borderBottom: '2px solid #f3f3f3' }}
          >
            <span className="absolute flex" style={{ left: 17, gap: 4 }}>
              <span className="rounded-full" style={{ width: 11, height: 11, backgroundColor: '#ed6c5d' }} />
              <span className="rounded-full" style={{ width: 11, height: 11, backgroundColor: '#f2c04c' }} />
              <span className="rounded-full" style={{ width: 11, height: 11, backgroundColor: '#5fc654' }} />
            </span>
            <span style={{ ...EN, fontSize: 16, color: '#828282' }}>Vercel Sandbox</span>
          </div>

          {/* 터미널 본문 (line-height 25px 고정 그리드) */}
          <pre
            className="absolute m-0"
            style={{ ...MONO, left: 29, top: 73, fontSize: 16, lineHeight: '25px', color: '#171717' }}
          >
            <span style={{ color: '#666666' }}># Production Environment: ✓ Protected</span>
            {'\n\n'}
            {'$ '}
            <span style={{ color: '#3d7d4f' }}>echo $API_SECRET</span>
            {'\n'}
            {'✗ Error: Undefined'}
            {'\n\n'}
            {'$ psql '}
            <span style={{ color: '#3d7d4f' }}>$DATABASE_URL</span>
            {'\n'}
            {'✗ Error: Database connection blocked'}
            {'\n\n'}
            {'$ aws s3 '}
            <span style={{ color: '#6f4a95' }}>ls</span>
            {' s3://prod-bucket'}
            {'\n'}
            {'✗ Error: Cloud resources isolated'}
          </pre>
        </div>

        {/* ── 커넥터 (카드 위에 겹침 — 양끝 포트 원이 카드 테두리에 얹힘) ── */}
        <svg viewBox="0 0 2000 604" className="pointer-events-none absolute inset-0 h-full w-full" fill="none">
          <path d="M942 283 H1010" stroke="#f5ab24" strokeWidth="2" />
          <circle cx="940" cy="283" r="4.5" fill="#ffffff" stroke="#d9d9d9" strokeWidth="1.5" />
          <circle cx="1013" cy="283" r="4.5" fill="#ffffff" stroke="#d9d9d9" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
