'use client';

/**
 * Vercel 디자인 소스 복제 #3 — "The safest way to run code you didn't write" (Sandbox 히어로).
 * 원본(image-1783929630233) 1:1 좌표계(2000×948)로 픽셀 복제.
 * 좌측 헤드라인+본문+버튼 2개 / 우측 브라우저 창(3×3 점선 그리드 + Sandbox 상태) 위에
 * Agent 미니 창(세로 점선 3분할 + 프롬프트 카드) 겹침 / 우하단 Play demo.
 * 디자인 소스(레이아웃 학습·변형용). 홈 삽입 시 scale/반응형은 변형 단계에서.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;
const MONO = {
  fontFamily: "ui-monospace, 'SFMono-Regular', 'Menlo', 'Consolas', monospace",
} as const;

/** macOS 신호등 3점 (지름 10, 중심 간격 14) */
function TrafficDots({ left, top }: { left: number; top: number }) {
  return (
    <div className="absolute flex" style={{ left, top, gap: 4 }}>
      <span className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: '#ec6a5e' }} />
      <span className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: '#f4bf4f' }} />
      <span className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: '#61c454' }} />
    </div>
  );
}

/** 자물쇠 아이콘 (URL 바) */
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <rect x="2.2" y="5.6" width="8.6" height="6" rx="1.2" stroke="#7d7d7d" strokeWidth="1.1" />
      <path d="M4.1 5.4V4a2.4 2.4 0 0 1 4.8 0v1.4" stroke="#7d7d7d" strokeWidth="1.1" />
    </svg>
  );
}

/** 큐브 + 지구본 아이콘 (Sandbox) */
function SandboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* 큐브 (패키지) */}
      <path
        d="M10 2.4 3.4 6.1a1.4 1.4 0 0 0-.7 1.2v7.4c0 .5.27.97.7 1.2l6.6 3.7c.43.24.97.24 1.4 0l2-1.13"
        stroke="#4b4b4b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3 9.4v-2.1c0-.5-.27-.97-.7-1.2L10 2.4c-.43-.24-.97-.24-1.4 0"
        stroke="#4b4b4b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 6.9 10 10.8l7-3.9" stroke="#4b4b4b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 10.6v8.6" stroke="#4b4b4b" strokeWidth="1.5" strokeLinecap="round" />
      {/* 지구본 마스크용 흰 원 */}
      <circle cx="17.4" cy="16.4" r="6.6" fill="#ffffff" />
      {/* 지구본 */}
      <circle cx="17.4" cy="16.4" r="4.6" stroke="#4b4b4b" strokeWidth="1.4" />
      <path d="M12.9 16.4h9" stroke="#4b4b4b" strokeWidth="1.4" />
      <ellipse cx="17.4" cy="16.4" rx="2" ry="4.6" stroke="#4b4b4b" strokeWidth="1.4" />
    </svg>
  );
}

/** Play 아이콘 (원 + 삼각형) */
function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10.2" stroke="#171717" strokeWidth="1.6" />
      <path d="M10 8.6v6.8l5.4-3.4L10 8.6Z" fill="#171717" />
    </svg>
  );
}

export default function Clone03() {
  return (
    <div className="w-full overflow-x-auto" style={{ backgroundColor: '#fafafa' }}>
      <div className="relative" style={{ width: 2000, height: 948 }}>
        {/* ══ 좌측 텍스트 블록 ══ */}
        <h2
          className="absolute font-semibold"
          style={{
            ...EN,
            left: 164,
            top: 270,
            fontSize: 76,
            lineHeight: '80px',
            letterSpacing: '-0.025em',
            color: '#171717',
          }}
        >
          The safest way to run
          <br />
          code you didn&rsquo;t write
        </h2>

        <p
          className="absolute"
          style={{
            ...EN,
            left: 164,
            top: 464,
            fontSize: 24,
            lineHeight: '37px',
            letterSpacing: '-0.01em',
            color: '#565656',
          }}
        >
          Modern apps increasingly need to execute code they didn&rsquo;t
          <br />
          author. From AI agents, customer scripts, or dynamic systems.
        </p>

        {/* 버튼 2개 */}
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{ ...EN, left: 165, top: 574, width: 148, height: 50, backgroundColor: '#171717' }}
        >
          <span className="font-semibold" style={{ fontSize: 22, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Get started
          </span>
        </div>
        <div
          className="absolute flex items-center justify-center rounded-full border bg-white"
          style={{
            ...EN,
            left: 332,
            top: 574,
            width: 174,
            height: 50,
            borderColor: '#e8e8e8',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <span className="font-semibold" style={{ fontSize: 22, color: '#171717', letterSpacing: '-0.01em' }}>
            See examples
          </span>
        </div>

        {/* ══ 브라우저 창 (뒤) ══ */}
        <div
          className="absolute overflow-hidden rounded-xl border bg-white"
          style={{
            left: 1184,
            top: 124,
            width: 700,
            height: 615,
            borderColor: '#e8e8e8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* 헤더 */}
          <div className="relative" style={{ height: 46, borderBottom: '1px solid #ececec' }}>
            <TrafficDots left={15} top={18} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ gap: 7 }}>
              <LockIcon />
              <span style={{ ...MONO, fontSize: 15, color: '#7d7d7d', letterSpacing: '0.01em' }}>
                remote-sandbox.vercel.run
              </span>
            </div>
          </div>

          {/* 내부 3×3 점선 그리드 (헤더 아래, 창 내부 좌표계 698×568) */}
          <svg
            className="absolute left-0"
            style={{ top: 46 }}
            width="698"
            height="568"
            viewBox="0 0 698 568"
            fill="none"
            aria-hidden
          >
            {/* 세로 점선 x=233.5, 466 / 가로 점선 y=174.5, 392.5 (원본 1418·1650.5 / 345·563) */}
            <line x1="233.5" y1="0" x2="233.5" y2="568" stroke="#ececec" strokeDasharray="3 3" />
            <line x1="466" y1="0" x2="466" y2="568" stroke="#ececec" strokeDasharray="3 3" />
            <line x1="0" y1="174.5" x2="698" y2="174.5" stroke="#ececec" strokeDasharray="3 3" />
            <line x1="0" y1="392.5" x2="698" y2="392.5" stroke="#ececec" strokeDasharray="3 3" />
          </svg>

          {/* 중앙 셀: Sandbox 아이콘 + 상태 텍스트 (창 내부 좌표) */}
          <div
            className="absolute flex items-center justify-center rounded-[10px] border bg-white"
            style={{
              left: 330,
              top: 280,
              width: 40,
              height: 40,
              borderColor: '#ececec',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <SandboxIcon />
          </div>
          <div
            className="absolute text-center font-medium"
            style={{ ...EN, left: 150, top: 351, width: 400, fontSize: 21, color: '#171717', letterSpacing: '-0.01em' }}
          >
            Sandbox is not running
          </div>
        </div>

        {/* ══ Agent 미니 창 (앞, 브라우저 좌하단에 겹침) ══ */}
        <div
          className="absolute z-10 overflow-hidden rounded-xl border bg-white"
          style={{
            left: 1125,
            top: 367,
            width: 296,
            height: 431,
            borderColor: '#e8e8e8',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* 헤더 */}
          <div className="relative" style={{ height: 46, borderBottom: '1px solid #efefef' }}>
            <TrafficDots left={15} top={18} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ ...EN, fontSize: 16, color: '#8b8b8b' }}>Agent</span>
            </div>
          </div>

          {/* 내부 세로 점선 2개 (3등분, 창 내부 좌표계 294×383) */}
          <svg
            className="absolute left-0"
            style={{ top: 46 }}
            width="294"
            height="383"
            viewBox="0 0 294 383"
            fill="none"
            aria-hidden
          >
            <line x1="99" y1="0" x2="99" y2="383" stroke="#ececec" strokeDasharray="3 3" />
            <line x1="197" y1="0" x2="197" y2="383" stroke="#ececec" strokeDasharray="3 3" />
          </svg>

          {/* 프롬프트 카드 */}
          <div
            className="absolute flex items-center justify-center rounded-lg border bg-white text-center"
            style={{
              left: 50,
              top: 198,
              width: 196,
              height: 79,
              borderColor: '#e3e3e3',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ ...EN, fontSize: 16, lineHeight: '20px', color: '#171717' }}>
              Generate a Next.js
              <br />
              app to list, search and
              <br />
              copy Emojis
            </span>
          </div>
        </div>

        {/* ══ Play demo (우하단) ══ */}
        <div className="absolute flex items-center" style={{ left: 1744, top: 766, gap: 12 }}>
          <PlayIcon />
          <span className="font-medium" style={{ ...EN, fontSize: 21, color: '#171717', letterSpacing: '-0.01em' }}>
            Play demo
          </span>
        </div>
      </div>
    </div>
  );
}
