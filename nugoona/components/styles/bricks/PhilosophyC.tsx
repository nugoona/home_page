'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * 벽돌3 · 철학 시안 C — 창업자 편지형
 * 좌측 accent 세로 바 + 왼쪽정렬 본문 + 회사 서명. 진정성·목소리를 강조.
 * 서명은 회사명(누구나컴퍼니) — 카피 지어내기 아님. 목업 없음.
 */
export default function PhilosophyC() {
  return (
    <div className="py-[120px] px-12 max-md:py-16 max-md:px-6 flex justify-center bg-white">
      <div className="w-full max-w-[620px]">
        <FadeUp>
          <div className="border-l-2 border-[#0070f3] pl-7 max-md:pl-5">
            <h2
              className="text-[clamp(28px,4vw,42px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-6"
              dangerouslySetInnerHTML={{ __html: philosophy.heading }}
            />
            <p className="text-[17px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.75]">
              {philosophy.body}
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.16}>
          <p className="mt-8 pl-7 max-md:pl-5 text-[14px] font-medium tracking-[0.02em] text-[#9aa7b5]">
            — 누구나컴퍼니
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
