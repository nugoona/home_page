'use client';

/**
 * /lab/exposure = 콘텐츠·광고 두 "장면" (히어로 다음 분기)
 * 실제 아이폰 목업 + 앱 스샷 + 실제 로고(nc/na). 좌우 대칭 지그재그.
 */

import PhoneScene from '@/components/styles/bricks/PhoneScene';
import AdScene from '@/components/styles/bricks/AdScene';

const EN = { fontFamily: 'var(--font-en)' } as const;

export default function LabExposure() {
  return (
    <main className="bg-white min-h-screen">
      <div className="border-b border-border-default px-6 py-5">
        <p className="text-[12px] font-semibold text-accent tracking-[0.08em] uppercase mb-1" style={EN}>Brick 02 · Two Scenes</p>
        <h1 className="text-[20px] max-md:text-[18px] font-bold text-text-primary">콘텐츠 · 광고 두 장면 (실제 앱 + 폰 목업)</h1>
        <p className="text-[14px] text-text-weak mt-1">실제 아이폰 목업에 앱 스샷 + 실제 로고(Nc·Na). 좌우 대칭 지그재그.</p>
      </div>

      <PhoneScene />
      <div className="border-t border-border-default" />
      <AdScene />
    </main>
  );
}
