'use client';

import FadeUp from '@/components/motion/FadeUp';
import { philosophy } from '@/lib/content/home';

/**
 * 벽돌3 · 철학 시안 B — 좌우 2단 + 시간축
 * 좌: 큰 헤딩 / 우: 본문 + 절제된 연도 축(2011→2026, 점 2개·세로 accent 선).
 * "15년의 축적"을 사실 연도로만 거든다 — IT 노드·순위 아님(§8.7-I 금지 게이트 준수).
 */
export default function PhilosophyB() {
  return (
    <div className="py-[120px] px-12 max-md:py-16 max-md:px-6 flex justify-center bg-white">
      <div className="grid w-full max-w-[1000px] grid-cols-[1fr_1.1fr] gap-16 max-md:grid-cols-1 max-md:gap-10">
        {/* 좌 · 헤딩 */}
        <FadeUp>
          <h2
            className="text-[clamp(30px,4.2vw,48px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.12]"
            dangerouslySetInnerHTML={{ __html: philosophy.heading }}
          />
        </FadeUp>

        {/* 우 · 본문 + 연도 축 */}
        <FadeUp delay={0.12}>
          <div className="flex gap-6">
            {/* 세로 연도 축 */}
            <div className="flex flex-col items-center pt-1 max-md:hidden">
              <span className="text-[13px] font-semibold tracking-[0.06em] text-[#0070f3]">2011</span>
              <span className="my-2 w-px flex-1 bg-gradient-to-b from-[#0070f3] to-[#c9d3de]" />
              <span className="text-[13px] font-semibold tracking-[0.06em] text-[#9aa7b5]">2026</span>
            </div>
            <p className="text-[17px] max-md:text-[16px] max-md:font-medium text-text-body leading-[1.75]">
              {philosophy.body}
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
