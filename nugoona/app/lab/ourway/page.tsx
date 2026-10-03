'use client';

import MobileOrbit from '@/components/home/s3/MobileOrbit';

/**
 * OUR WAY 모바일 최종 흐름 시안(2026-07-15 사장님 상세 스펙 + Vercel 디테일 차용).
 *   ① 헤드라인+설명 → ② 궤도(빔) → ③ 연결선(접점 노드+흐르는 도트) → ④ 선언(선 중간)
 *   → ⑤ 연결선 → ⑥ 채팅(브라우저 창 chrome으로 "깨기")
 * 디테일 출처: 신호등 3점=Clone03 / 선 끝 fade·접점=Clone01 / 흐르는 도트=S9_ChannelFanout.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const EN = { fontFamily: 'var(--font-en)' } as const;
const ACCENT = '#0070f3';

/* macOS 신호등 3점 (Clone03 색 실측) — 브라우저 창 chrome */
function TrafficDots() {
  return (
    <span className="flex items-center gap-[5px]" aria-hidden>
      <span className="h-[9px] w-[9px] rounded-dot" style={{ background: '#ec6a5e' }} />
      <span className="h-[9px] w-[9px] rounded-dot" style={{ background: '#f4bf4f' }} />
      <span className="h-[9px] w-[9px] rounded-dot" style={{ background: '#61c454' }} />
    </span>
  );
}

/* 세로 연결선 — accent 반투명 선 + glow 도트(S9). 위/아래 끝을 fade시켜 도형에 녹아듦(Clone01). */
function FlowLine({ h = 40 }: { h?: number }) {
  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{ width: 2, height: h, background: 'rgba(0,112,243,0.55)' }}
      aria-hidden
    >
      <span
        className="animate-pipeline-flow absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2"
        style={{ background: `radial-gradient(circle, ${ACCENT} 0%, rgba(0,112,243,0.35) 42%, transparent 70%)` }}
      />
    </div>
  );
}

/* 봇 마크 (chrome 라벨용 미니) */
function BotMark({ size = 13, color = '#fff', bg = '#171717' }: { size?: number; color?: string; bg?: string }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-dot" style={{ width: size + 9, height: size + 9, background: bg }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 5v3" /><circle cx="9" cy="13" r="0.6" fill={color} /><circle cx="15" cy="13" r="0.6" fill={color} />
      </svg>
    </span>
  );
}

/* 채팅 — 브라우저 창 chrome으로 감싸 "깬다"(사장님). 흰 창 + 신호등 + 도우미 라벨. */
function BrowserChat() {
  return (
    <div className="relative mx-auto max-w-[344px] overflow-hidden rounded-[14px] border border-[#e8e8e8] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.07)]">
      {/* chrome bar */}
      <div className="flex items-center gap-2.5 border-b border-[#f0f0f0] bg-[#fafafa] px-3.5 py-2.5">
        <TrafficDots />
        <span className="flex items-center gap-1.5">
          <BotMark size={11} />
          <span className="text-[11px] font-semibold tracking-[-0.01em] text-[#6b7078]" style={KR}>광고 도우미</span>
        </span>
      </div>
      {/* 본문 말풍선 */}
      <div className="space-y-3 px-4 py-4">
        {/* 사용자(우측, accent) */}
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-[15px] rounded-br-[5px] px-3.5 py-2.5" style={{ background: ACCENT }}>
            <p className="text-[13.5px] font-semibold leading-[1.5] text-white" style={KR}>
              설정은 이제 다 끝난 거야?<br />소재만 고르면 돼?
            </p>
          </div>
        </div>
        {/* 도우미(좌측, 흰 카드) */}
        <div className="flex items-start gap-2">
          <BotMark size={12} />
          <div className="max-w-[86%] rounded-[15px] rounded-tl-[5px] border border-[#ececec] bg-[#f7f8fa] px-3.5 py-2.5">
            <p className="text-[13.5px] font-medium leading-[1.55] text-[#171717]" style={KR}>
              네. 광고 준비는 모두 끝났습니다.<br />소재를 고르면 바로 시작할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OurWayLab() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white px-6 py-12">
      <div className="mx-auto max-w-[390px]">
        <div className="mb-6 text-[11px] font-bold tracking-[0.14em] text-neutral-300" style={EN}>MOBILE — OUR WAY (시안)</div>

        {/* ① 헤드라인 + 설명 */}
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a6]" style={EN}>Our Way</span>
          <h2 className="mt-2 text-[26px] font-bold leading-[1.28] tracking-[-0.035em] text-[#171717]" style={KR}>
            어려운 건 앱이 합니다
          </h2>
          <p className="mx-auto mt-3 max-w-[300px] text-[14px] font-medium leading-[1.55] text-[#5b6069]" style={KR}>
            광고를 시작하기 위한 복잡한 준비를<br />앱이 먼저 처리합니다.
          </p>
        </div>

        {/* ② 궤도 */}
        <div className="mt-8">
          <MobileOrbit started />
        </div>

        {/* ③ 궤도 → 선언 연결선 */}
        <FlowLine h={40} />

        {/* ④ 선언 — 텍스트 바(약간 라운드) + 짧고 연한 선명 그림자(blur 0, offset 2px). 연결선 중간에 끼움. */}
        <div className="flex justify-center">
          <div
            className="border border-[#e6e6e6] bg-white px-6 py-5 text-center"
            style={{ boxShadow: '3px 4px 0 rgba(15,23,42,0.12)' }}
          >
            <h3 className="text-[26px] font-bold leading-[1.28] tracking-[-0.035em] text-[#171717]" style={KR}>
              고객님은<br />광고 소재와 성과만 보세요.
            </h3>
          </div>
        </div>

        {/* ⑤ 선언 → 채팅 연결선 */}
        <FlowLine h={40} />

        {/* ⑥ 채팅(브라우저 창) — 연결선과 딱 맞물리게 간격 제거 */}
        <BrowserChat />
      </div>
    </main>
  );
}
