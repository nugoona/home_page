'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S3 · 우리의 방식 "어려운 건 앱이 맡고, 결정은 사람이 합니다" — 플로우 다이어그램.
 * Vercel Provider 문법 차용: 앱 카드(준비·설명·알림) → fade 커넥터 + '결정' pill → 사장님 노드.
 * 카피 = home.ts homeV2.ourWay (토씨 유지). body[1]=사람이 하는 일.
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] h-4 w-4 shrink-0" fill="none" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-6.5" />
    </svg>
  );
}

export default function OurWayFlow() {
  const { head, body } = homeV2.ourWay;
  const appItems = ['준비하고', '설명하고', '다음 일을 알려줍니다'];
  return (
    <section
      className="relative overflow-hidden bg-[#fbfbfc] px-6 py-[110px] max-md:py-16"
      style={{ backgroundImage: 'radial-gradient(rgba(15,23,42,0.05) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
    >
      <div className="relative mx-auto max-w-[1040px]">
        <FadeUp>
          <span className="text-[11px] tracking-[0.18em] text-text-muted/70" style={EN}>
            S3 — OUR WAY
          </span>
          <h2
            className="mb-16 mt-4 max-w-[640px] text-[clamp(26px,3.6vw,40px)] font-bold text-text-primary tracking-[-0.03em] leading-[1.24] text-balance"
            dangerouslySetInnerHTML={{ __html: head }}
          />
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative flex items-center justify-between gap-8 max-md:flex-col max-md:gap-6">
            {/* 앱 카드 — 앱이 하는 일 */}
            <div className="w-[320px] shrink-0 overflow-hidden rounded-[16px] border border-border-light bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] max-md:w-full max-md:max-w-[360px]">
              <div className="flex items-center gap-2 border-b border-border-light px-4 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e4e5e7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#e4e5e7]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#e4e5e7]" />
                <span className="ml-2 text-[13px] font-bold text-accent" style={EN}>APP</span>
              </div>
              <div className="space-y-3 px-5 py-6">
                {appItems.map((it, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check />
                    <p className="text-[16px] text-text-primary leading-[1.4] tracking-[-0.01em]">{it}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 커넥터 + '결정' pill */}
            <div className="relative h-24 flex-1 max-md:h-16 max-md:w-full">
              <svg viewBox="0 0 320 96" className="absolute inset-0 h-full w-full max-md:hidden" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ow-line" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#141414" stopOpacity="0" />
                    <stop offset="0.2" stopColor="#141414" stopOpacity="0.9" />
                    <stop offset="0.8" stopColor="#141414" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#141414" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="48" x2="320" y2="48" stroke="url(#ow-line)" strokeWidth="1.5" />
              </svg>
              <svg viewBox="0 0 32 64" className="absolute left-1/2 top-0 hidden h-full w-8 -translate-x-1/2 max-md:block" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ow-line-v" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#141414" stopOpacity="0" />
                    <stop offset="0.25" stopColor="#141414" stopOpacity="0.9" />
                    <stop offset="0.75" stopColor="#141414" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#141414" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="16" y1="0" x2="16" y2="64" stroke="url(#ow-line-v)" strokeWidth="1.5" />
              </svg>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ededef] bg-white px-4 py-2 text-[14px] font-medium text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                결정
              </span>
            </div>

            {/* 사장님 노드 — 사람이 하는 일 */}
            <div className="w-[320px] shrink-0 max-md:w-full max-md:max-w-[360px]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#141414]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
                  </svg>
                </span>
                <span className="text-[16px] font-semibold text-text-primary">사장님</span>
              </div>
              <p className="mt-4 text-[16px] max-md:text-[15px] text-text-body leading-[1.55] tracking-[-0.01em]">
                {body[1]}
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
