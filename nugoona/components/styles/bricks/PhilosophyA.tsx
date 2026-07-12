'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * 벽돌3 · 철학 시안 A — 절제 중앙형(현행 정제)
 * 목업 없음(§8.7-H). 상단 연도 오버라인으로 "15년의 축적"을 사실로 거든다(순위·보장 아님).
 * 톤: 라이트 · 브랜드 블루 accent · 직각 · 미니멀.
 */
export default function PhilosophyA() {
  return (
    <div className="py-[120px] px-12 max-md:py-16 max-md:px-6 flex justify-center bg-white">
      <div className="max-w-[660px] text-center">
        <FadeUp>
          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d5dae1]" />
            <span className="text-[13px] font-semibold tracking-[0.14em] text-[#0070f3]">2011 — 2026</span>
            <span className="h-px w-8 bg-[#d5dae1]" />
          </div>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2
            className="text-[clamp(30px,4.4vw,46px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-7"
            dangerouslySetInnerHTML={{ __html: philosophy.heading }}
          />
        </FadeUp>
        <FadeUp delay={0.16}>
          <p className="text-[17px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.7]">
            {philosophy.body}
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
