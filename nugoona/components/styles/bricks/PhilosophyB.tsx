'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * 벽돌3 · 철학 롱폼 시안 B — 좌 제목 / 우 본문 2단 (에디토리얼)
 * 여는 문장 상단 전체폭 → 각 막 좌측 제목 / 우측 본문. 막 사이 얇은 구분선.
 */
export default function PhilosophyB() {
  return (
    <div className="bg-white py-[120px] px-6 max-md:py-16 flex justify-center">
      <div className="w-full max-w-[940px]">
        <FadeUp>
          <p className="text-[15px] max-md:text-[14px] text-text-weak mb-14 max-md:mb-10">
            {philosophy.opening}
          </p>
        </FadeUp>

        <div className="flex flex-col">
          {philosophy.acts.map((act, i) => (
            <FadeUp key={i} delay={0.08 * i}>
              <div className="grid grid-cols-[300px_1fr] gap-14 py-11 max-md:grid-cols-1 max-md:gap-4 max-md:py-8 border-t border-border-default first:border-t-0 first:pt-0">
                <h3 className="text-[clamp(21px,2.4vw,27px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.3]">
                  <span className="mr-2 text-[#0070f3]">{String(i + 1).padStart(2, '0')}</span>
                  {act.title}
                </h3>
                <p className="text-[17px] max-md:text-[16px] text-text-body leading-[1.85]">
                  {act.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}
