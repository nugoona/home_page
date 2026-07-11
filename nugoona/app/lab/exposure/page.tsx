'use client';

/**
 * /lab/exposure = 콘텐츠 "장면" 시안 (히어로 다음)
 * 실제 앱 홈 스샷을 그대로 + 이미지 위/옆에 로고·카피. 사장님 방향 2026-07-12.
 */

import PhoneScene from '@/components/styles/bricks/PhoneScene';

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function LabExposure() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Content Scene</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">콘텐츠 장면 — 실제 앱 홈 + 로고·카피</h1>
        <p className="text-[14px] text-text-weak mt-1">실제 앱 홈 스샷(상태바 제거)을 그대로. 기니까 이미지 옆/위에 로고·카피를 얹은 초안입니다.</p>
      </div>

      <PhoneScene />
    </main>
  );
}
