'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S2 · WHY "복잡한 시작" — Vercel식 칸 그리드(내용에 맞춘 셀 레이아웃).
 * 배경 격자무늬가 아니라 콘텐츠를 hairline border로 구획: 헤드 칸 → 3스텝 칸 → 결론 칸.
 * 교차점 "+" 마커. 목업 없음(카피가 칸에 담김). 카피 = home.ts homeV2.why (토씨 유지).
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

/* 그리드 모서리 "+" 마커 */
function PlusMark({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute z-10 block h-3.5 w-3.5 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(15,23,42,0.28)]" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-[rgba(15,23,42,0.28)]" />
    </span>
  );
}

export default function WhyGridSection() {
  const { head, steps, conclusion } = homeV2.why;
  return (
    <section className="relative bg-[#fbfbfc] px-6 py-[100px] max-md:py-16 flex justify-center">
      <FadeUp>
        <div className="relative w-full max-w-[1080px] border border-border-light">
          <PlusMark className="-left-[7px] -top-[7px]" />
          <PlusMark className="-right-[7px] -top-[7px]" />
          <PlusMark className="-left-[7px] -bottom-[7px]" />
          <PlusMark className="-right-[7px] -bottom-[7px]" />

          {/* 헤드 칸 */}
          <div className="border-b border-border-light px-9 py-11 max-md:px-6 max-md:py-8">
            <span className="text-[11px] tracking-[0.18em] text-text-muted/70" style={EN}>
              S2 — WHY
            </span>
            <h2
              className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold text-text-primary tracking-[-0.03em] leading-[1.24] text-balance"
              dangerouslySetInnerHTML={{ __html: head }}
            />
          </div>

          {/* 3스텝 칸 — 복잡한 시작의 3요소 */}
          <div className="grid grid-cols-3 border-b border-border-light max-md:grid-cols-1">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`px-9 py-10 max-md:px-6 max-md:py-6 ${
                  i < steps.length - 1
                    ? 'border-r border-border-light max-md:border-r-0 max-md:border-b'
                    : ''
                }`}
              >
                <span className="text-[13px] font-bold tabular-nums text-accent" style={EN}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-[17px] max-md:text-[15px] font-medium text-text-primary leading-[1.4] tracking-[-0.01em]">
                  {s}
                </p>
              </div>
            ))}
          </div>

          {/* 결론 칸 */}
          <div className="px-9 py-8 max-md:px-6 max-md:py-6">
            <p className="text-[16px] max-md:text-[14px] text-text-body leading-[1.6] tracking-[-0.01em]">
              {conclusion}
            </p>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
