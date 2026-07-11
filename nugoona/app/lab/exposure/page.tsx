'use client';

/**
 * /lab/exposure = "검색에 보인다" 목업 재작업 (금지 게이트 준수 — 순위·짝퉁·파스텔 배제)
 * 컨셉 = 채워지는 채널(블로그·플레이스·인스타에 내 가게 콘텐츠가 채워짐). 사장님 컨셉 승인 2026-07-11.
 */

import ExposureFill from '@/components/styles/bricks/ExposureFill';

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function LabExposure() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Content Mock (재작업)</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">“검색에 보인다” — 채워지는 채널</h1>
        <p className="text-[14px] text-text-weak mt-1">순위·짝퉁 검색화면·파스텔 배제. 블로그·플레이스·인스타에 내 가게 콘텐츠가 채워지며 그린 체크가 점등합니다.</p>
      </div>

      <div className="max-w-[560px] mx-auto px-6 py-16">
        {/* 실제 콘텐츠 카드 맥락 */}
        <div className="flex flex-col border border-border-default bg-white">
          <div className="relative h-[248px] overflow-hidden bg-bg-alt border-b border-border-default flex items-center">
            <span className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#2fd46b', opacity: 0.55 }} />
            <ExposureFill />
          </div>
          <div className="p-7">
            <p className="flex items-center gap-2 text-[11px] font-semibold text-text-weak tracking-[0.08em] uppercase mb-3" style={EN}>
              <span style={{ width: 6, height: 6, background: '#2fd46b', borderRadius: '50%' }} />
              누구나 콘텐츠
            </p>
            <h3 className="text-[22px] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3">
              검색에 <span className="text-accent">보이고</span> 싶습니다
            </h3>
            <p className="text-[14px] text-text-body leading-[1.65]">블로그와 플레이스, SNS까지. 검색에서 고객이 내 가게를 먼저 만나는 시작.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
