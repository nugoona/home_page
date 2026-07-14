'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S4 · 두 앱 도입 헤더 "하는 일이 다르니까, 앱도 달라야 합니다".
 * 바로 뒤 폰 목업(콘텐츠·광고) 섹션의 도입 — 히어로 범례와 통일된 두 제품 색 점 라벨.
 * 카피 = home.ts homeV2.twoAppsHead (토씨 유지).
 */
export default function TwoAppsHeader() {
  return (
    <div className="flex justify-center px-6 py-[90px] max-md:py-14">
      <FadeUp>
        <div className="mx-auto max-w-[680px] text-center">
          <h2
            className="text-[clamp(26px,3.8vw,40px)] font-bold text-text-primary tracking-[-0.03em] leading-[1.25] text-balance"
            dangerouslySetInnerHTML={{ __html: homeV2.twoAppsHead }}
          />
          <div className="mt-7 flex items-center justify-center gap-5 text-[14px] text-text-weak max-md:text-[13px]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: '#4d9fff' }} />
              누구나 콘텐츠
            </span>
            <span className="h-3 w-px bg-border-default" />
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: '#29d5ff' }} />
              누구나 광고
            </span>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
