'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S5 · 회사 철학 "좋은 가게는 발견될 기회가 있어야 합니다" — 다크 감성 섹션.
 * 히어로의 다크+격자+빛 언어를 절제 계승(리듬 전환점). 짝퉁 실물·AI슬롭 없이 타이포·여백·한 줄기 빛으로.
 * 카피 = home.ts homeV2.brandPhilosophy (토씨 변경 금지).
 */
export default function BrandPhilosophySection() {
  const { head, body } = homeV2.brandPhilosophy;
  return (
    <section
      className="relative overflow-hidden px-6 py-[150px] max-md:py-24 flex justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 38%, #0d1525 0%, #070b16 48%, #000 100%)' }}
    >
      {/* 무대 — 도트 그리드 + 가장자리 페이드 (히어로/목업 8조 언어) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(58%_54%_at_50%_40%,#000_18%,transparent_86%)]"
      />
      {/* 발견의 빛 — accent 글로우 1곳(절제) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[36%] h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(closest-side,rgba(0,112,243,0.11),transparent)]"
      />

      <div className="relative w-full max-w-[720px]">
        <FadeUp>
          <h2
            className="text-[clamp(30px,4.6vw,52px)] font-bold text-white tracking-[-0.03em] leading-[1.22] text-balance mb-9"
            dangerouslySetInnerHTML={{ __html: head }}
          />
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="max-w-[560px] space-y-4">
            {body.map((p, i) => (
              <p
                key={i}
                className="text-[16px] max-md:text-[14px] leading-[1.65] tracking-[-0.01em] text-white/55"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
