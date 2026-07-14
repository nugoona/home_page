'use client';

/**
 * Vercel 디자인 소스 복제 #1 — "Provider degraded? → primary/fallback" 플로우.
 * 원본(image-1783929616832) 1:1 좌표계(1946×716)로 픽셀 복제. 커넥터 끝 fade 포함.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

function Dot() {
  return <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#d6d6d8]" />;
}
function Bar({ left, top, w }: { left: number; top: number; w: number }) {
  return <div className="absolute rounded-full bg-[#ebebed]" style={{ left, top, width: w, height: 12 }} />;
}

function AnthropicMark() {
  return (
    <span className="select-none text-[30px] font-bold leading-none text-[#141414]" style={EN}>
      A\
    </span>
  );
}
function AwsMark() {
  return (
    <span className="relative inline-block select-none leading-none">
      <span className="text-[23px] font-bold tracking-tight text-[#252f3e]" style={EN}>aws</span>
      <svg viewBox="0 0 44 9" className="absolute -bottom-2.5 left-0 w-[40px]" fill="none">
        <path d="M1 2.5 C 14 9, 30 9, 43 2.5" stroke="#ff9900" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M39 1.5 L43 2.5 L41 6" stroke="#ff9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function ProviderFallback() {
  return (
    <div
      className="w-full overflow-x-auto"
      style={{
        backgroundColor: '#fafafa',
        backgroundImage: 'radial-gradient(rgba(15,23,42,0.10) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="relative" style={{ width: 1946, height: 716 }}>
        {/* ── SVG 커넥터 (요소 뒤, 끝 fade) ── */}
        <svg viewBox="0 0 1946 716" className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            <linearGradient id="pf-h" x1="658" y1="0" x2="890" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#141414" stopOpacity="0" />
              <stop offset="0.42" stopColor="#141414" stopOpacity="1" />
              <stop offset="1" stopColor="#141414" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="pf-p" x1="1154" y1="0" x2="1398" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#c4c5c7" stopOpacity="0" />
              <stop offset="0.2" stopColor="#c4c5c7" stopOpacity="1" />
              <stop offset="0.82" stopColor="#c4c5c7" stopOpacity="1" />
              <stop offset="1" stopColor="#c4c5c7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="pf-f" x1="1154" y1="0" x2="1398" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#141414" stopOpacity="0" />
              <stop offset="0.2" stopColor="#141414" stopOpacity="1" />
              <stop offset="0.82" stopColor="#141414" stopOpacity="1" />
              <stop offset="1" stopColor="#141414" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* 앱 → pill (수평, 앱쪽 fade) */}
          <path d="M658 388 H890" stroke="url(#pf-h)" strokeWidth="1.6" />
          {/* pill → primary (위, dashed, 양끝 fade) */}
          <path d="M1154 388 C 1256 388, 1300 205, 1398 205" stroke="url(#pf-p)" strokeWidth="1.6" strokeDasharray="6 6" />
          {/* pill → fallback (아래, solid, 양끝 fade) */}
          <path d="M1154 388 C 1256 388, 1300 565, 1398 565" stroke="url(#pf-f)" strokeWidth="1.6" />
        </svg>

        {/* ── 앱 skeleton 카드 ── */}
        <div
          className="absolute rounded-[22px] bg-white shadow-[0_10px_36px_rgba(0,0,0,0.05)]"
          style={{ left: 264, top: 166, width: 394, height: 404 }}
        >
          <div className="absolute flex gap-2.5" style={{ left: 288 - 264, top: 195 - 166 }}>
            <Dot />
            <Dot />
            <Dot />
          </div>
          <p className="absolute font-bold leading-none text-[#cdced0]" style={{ left: 286 - 264, top: 244 - 166, fontSize: 44 }}>
            App
          </p>
          <Bar left={288 - 264} top={322 - 166} w={262} />
          <Bar left={288 - 264} top={358 - 166} w={205} />
          <div className="absolute rounded-[12px] bg-[#ebebed]" style={{ left: 288 - 264, top: 402 - 166, width: 345, height: 88 }} />
          <Bar left={288 - 264} top={524 - 166} w={235} />
          <Bar left={288 - 264} top={556 - 166} w={172} />
        </div>

        {/* ── 판정 pill ── */}
        <div className="absolute" style={{ left: 890, top: 362 }}>
          <span className="inline-flex items-center rounded-full border border-[#ededef] bg-white text-[16px] font-medium text-[#141414] shadow-[0_1px_2px_rgba(0,0,0,0.03)]" style={{ height: 52, paddingLeft: 22, paddingRight: 22 }}>
            Provider degraded?
          </span>
        </div>

        {/* ── primary / fallback 라벨 (곡선 위) ── */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: 1276, top: 296 }}>
          <span className="inline-flex items-center rounded-full bg-[#eeeef0] px-3.5 py-1.5 text-[14px] text-[#6b6c70]">primary</span>
        </div>
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: 1276, top: 476 }}>
          <span className="inline-flex items-center rounded-full bg-[#141414] px-3.5 py-1.5 text-[14px] font-medium text-white">fallback</span>
        </div>

        {/* ── primary 카드 ── */}
        <div
          className="absolute flex items-center gap-4 rounded-[16px] bg-white px-6 shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
          style={{ left: 1398, top: 164, width: 457, height: 84 }}
        >
          <span className="flex w-10 shrink-0 justify-center">
            <AnthropicMark />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-semibold leading-tight text-[#141414]">Claude Opus 4.8</p>
            <p className="text-[16px] leading-tight text-[#8a8b8f]">Anthropic</p>
          </div>
          <span className="shrink-0 rounded-md bg-[#f1f1f3] px-3 py-1.5 text-[15px] text-[#9a9b9f]">Degraded</span>
        </div>

        {/* ── fallback 카드 ── */}
        <div
          className="absolute flex items-center gap-4 rounded-[16px] border-[1.5px] border-[#141414] bg-white px-6"
          style={{ left: 1398, top: 506, width: 457, height: 116 }}
        >
          <span className="flex w-10 shrink-0 justify-center">
            <AwsMark />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-semibold leading-tight text-[#141414]">Claude Opus 4.8</p>
            <p className="text-[16px] leading-tight text-[#8a8b8f]" style={EN}>Amazon Bedrock</p>
          </div>
        </div>
      </div>
    </div>
  );
}
