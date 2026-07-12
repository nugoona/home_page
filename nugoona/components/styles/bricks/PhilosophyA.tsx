'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * 벽돌3 · 철학 롱폼 시안 A — 중앙 세로 서사 (글이 주인공, 미니멀)
 * 여는 문장 → 3막 세로. 각 막 = 번호 + 제목 + 본문. 목업 없음.
 * 톤: 라이트 · 브랜드 블루 accent · 직각 · 담백.
 */
export default function PhilosophyA() {
  return (
    <div className="bg-white py-[120px] px-6 max-md:py-16 flex justify-center">
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
