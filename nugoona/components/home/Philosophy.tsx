'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * S3 · 왜 만들었나 (라이트, 롱폼 3막 — 글이 주인공)
 * 카피 = home.ts philosophy(A안 확정 2026-07-12). 레이아웃 = 벽돌3 시안 택1 전 잠정 중앙형.
 * §8.7-I: 글이 주인공, 시각물은 각 막을 거들 뿐. 벽돌3 시안 확정 시 이 배치를 교체.
 */
export default function Philosophy() {
  return (
    <div className="py-[120px] px-6 max-md:py-16 flex justify-center">
      <div className="w-full max-w-[720px]">
        <FadeUp>
          <p className="text-center text-[15px] max-md:text-[14px] text-text-weak mb-16 max-md:mb-12">
            {philosophy.opening}
          </p>
        </FadeUp>

        <div className="flex flex-col gap-14 max-md:gap-11">
          {philosophy.acts.map((act, i) => (
            <FadeUp key={i} delay={0.08 * i}>
              <div className="text-center">
                <span className="mb-4 inline-block text-[13px] font-bold tracking-[0.1em] text-[#0070f3]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-4 text-[clamp(22px,3vw,30px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.3]">
                  {act.title}
                </h3>
                <p className="mx-auto max-w-[600px] text-[17px] max-md:text-[16px] text-text-body leading-[1.85]">
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
