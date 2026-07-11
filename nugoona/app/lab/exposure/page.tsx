'use client';

/**
 * /lab/exposure = "검색에 보인다" 목업 = 실제 앱 화면 재현 (사장님 방향 전환 2026-07-12)
 * 은유 SVG(퀄리티 한계) → 실제 "누구나 콘텐츠" 앱의 "내 가게 노출" 카드를 가상 업체로 재현.
 * 원본: ngn_upload/src/components/HomeExposureCards. 순위는 현황 표시(A13), 카피로 강조 안 함.
 */

import ExposureAppMock from '@/components/styles/bricks/ExposureAppMock';

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function LabExposure() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Content Mock (실제 앱 재현)</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">“검색에 보인다” — 실제 앱 화면 재현</h1>
        <p className="text-[14px] text-text-weak mt-1">은유 대신 진짜 제품(누구나 콘텐츠 앱의 “내 가게 노출” 카드)을 가상 업체 데이터로 재현. 순위는 화면 안 현황으로만, “등수 신경 쓰지 마세요” 문구 그대로.</p>
      </div>

      <div className="max-w-[720px] mx-auto px-6 py-16">
        {/* 콘텐츠 카드 맥락 */}
        <div className="flex flex-col border border-border-default bg-white">
          <div className="relative overflow-hidden bg-bg-alt border-b border-border-default">
            <span className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ background: '#2fd46b', opacity: 0.55 }} />
            <div className="min-h-[320px] flex items-center">
              <ExposureAppMock />
            </div>
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

        <p className="text-[13px] text-text-weak mt-6 leading-relaxed">
          ※ 실제 앱은 다크+블루 톤(모바일)이지만, 이 카드엔 “내 가게 노출” 영역만 떼어 밝게 담았습니다.
          폰 프레임에 넣을지, 지금처럼 카드로 담을지는 골라주세요.
        </p>
      </div>
    </main>
  );
}
