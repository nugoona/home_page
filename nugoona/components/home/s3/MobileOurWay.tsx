'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import MobileOrbit from './MobileOrbit';

/**
 * OUR WAY 모바일 전용 한 흐름(2026-07-15 사장님 확정, /lab/ourway에서 검증 후 이식).
 *   헤드라인+설명 → 궤도(빔·완료 체크, 1회) → 연결선 → 선언 바 → 연결선 → 채팅(브라우저 창)
 * PC(S3GraphicA OrbitScene/SpeechScene)는 공용이라 불변 — 이 컴포넌트는 md:hidden 자리에만 들어간다.
 * 디테일 출처: 신호등 3점=Clone03 / 흐르는 도트=S9 / 선명 그림자·다크 칩=사장님 지시.
 */

const KR = { fontFamily: 'var(--font-kr)' } as const;
const EN = { fontFamily: 'var(--font-en)' } as const;
const ACCENT = '#0070f3';

/* macOS 신호등 3점(Clone03 색) — 브라우저 창 chrome */
function TrafficDots() {
  return (
    <span className="flex items-center gap-[5px]" aria-hidden>
      <span className="h-[9px] w-[9px] rounded-dot" style={{ background: '#ec6a5e' }} />
      <span className="h-[9px] w-[9px] rounded-dot" style={{ background: '#f4bf4f' }} />
      <span className="h-[9px] w-[9px] rounded-dot" style={{ background: '#61c454' }} />
    </span>
  );
}

/* 세로 연결선 — 단색 accent(양끝 진하게 도형과 맞물림) + glow 도트(S9) */
function FlowLine({ h = 40 }: { h?: number }) {
  return (
    <div className="relative mx-auto overflow-hidden" style={{ width: 2, height: h, background: 'rgba(0,112,243,0.55)' }} aria-hidden>
      <span
        className="animate-pipeline-flow absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2"
        style={{ background: `radial-gradient(circle, ${ACCENT} 0%, rgba(0,112,243,0.35) 42%, transparent 70%)` }}
      />
    </div>
  );
}

/* 봇 마크(chrome 라벨·도우미 말풍선 앞) */
function BotMark({ size = 12 }: { size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-dot" style={{ width: size + 9, height: size + 9, background: '#171717' }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 5v3" /><circle cx="9" cy="13" r="0.6" fill="#fff" /><circle cx="15" cy="13" r="0.6" fill="#fff" />
      </svg>
    </span>
  );
}

/* 채팅 — 브라우저 창 chrome으로 감쌈(사장님 "박스 쳐서 깨라") */
function BrowserChat() {
  return (
    <div className="relative mx-auto max-w-[344px] overflow-hidden border border-[#e8e8e8] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.07)]">
      <div className="flex items-center gap-2.5 border-b border-[#f0f0f0] bg-[#fafafa] px-3.5 py-2.5">
        <TrafficDots />
        <span className="flex items-center gap-1.5">
          <BotMark size={11} />
          <span className="text-[11px] font-semibold tracking-[-0.01em] text-[#6b7078]" style={KR}>광고 도우미</span>
        </span>
      </div>
      <div className="space-y-3 px-4 py-4">
        {/* 사용자(우측, accent) */}
        <div className="flex justify-end">
          <div className="max-w-[85%] px-3.5 py-2.5" style={{ background: ACCENT }}>
            <p className="text-[13.5px] font-semibold leading-[1.5] text-white" style={KR}>
              설정은 이제 다 끝난 거야?<br />소재만 고르면 돼?
            </p>
          </div>
        </div>
        {/* 도우미(좌측, 흰 카드) */}
        <div className="flex items-start gap-2">
          <BotMark size={12} />
          <div className="max-w-[86%] border border-[#ececec] bg-[#f7f8fa] px-3.5 py-2.5">
            <p className="text-[13.5px] font-medium leading-[1.55] text-[#171717]" style={KR}>
              네. 광고 준비는 모두 끝났습니다.<br />소재를 고르면 바로 시작할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobileOurWay({ both = false }: { both?: boolean } = {}) {
  /* ★2026-09-18 `both` — 기본 false면 원본 홈 출력 그대로.
     true면 설명·선언이 두 앱 공통 표현으로 바뀐다(개선안 §3.3). 구 문구는 "광고를 시작하기 위한",
     "광고 소재와 성과만"이라 콘텐츠 고객에게는 남의 얘기였다. /home2에서만 켠다 */
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <div ref={ref} className="mx-auto max-w-[390px]">
      {/* ① 헤드라인 + 설명 */}
      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9aa0a6]" style={EN}>Our Way</span>
        <h2 className="mt-2 text-[26px] font-bold leading-[1.28] tracking-[-0.035em] text-text-primary" style={KR}>
          어려운 건 앱이 합니다
        </h2>
        <p className="mx-auto mt-3 max-w-[300px] text-[14px] font-medium leading-[1.55] text-[#5b6069]" style={KR}>
          {/* 2026-10-08 대본 합의안① — PC(S3GraphicA)와 같은 문장. 분기 폐지 */}
          <>콘텐츠도 광고도, 복잡한 준비를<br />앱이 먼저 처리합니다.</>
        </p>
      </div>

      {/* ② 궤도 */}
      <div className="mt-8">
        <MobileOrbit started={inView} both={both} />
      </div>

      {/* ③ 궤도 → 선언 연결선 */}
      <FlowLine h={40} />

      {/* ④ 선언 — 텍스트 바(Vercel DevCycle 카드 스타일: 그림자 없음, 옅은 1px 테두리, 흰 배경) */}
      <div className="flex justify-center">
        <div className="border border-[#ededed] bg-white px-7 py-5 text-center">
          <h2 className="text-[26px] font-bold leading-[1.28] tracking-[-0.035em] text-text-primary" style={KR}>
            {both ? <>고객님은 확인하고<br />결정만 하세요.</> : <>고객님은 광고 소재와<br />성과만 보세요.</>}
          </h2>
        </div>
      </div>

      {/* ⑤ 선언 → 채팅 연결선 */}
      <FlowLine h={40} />

      {/* ⑥ 채팅(브라우저 창) — 연결선과 딱 맞물리게 */}
      <BrowserChat />
    </div>
  );
}
