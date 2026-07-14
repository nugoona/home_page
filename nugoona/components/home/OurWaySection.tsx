'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S3 · 우리의 방식 "어려운 건 앱이 맡고, 결정은 사람이 합니다" — 2칸 대비 그리드.
 * Vercel 칸 그리드 문법(hairline divider + '+' 교차 마커) 차용. 목업 없이 카피가 칸에 담김.
 * 좌칸=앱이 하는 일 / 우칸=사람이 하는 일. 카피 = home.ts homeV2.ourWay (토씨 유지).
 */

const EN = { fontFamily: 'var(--font-en)' } as const;

function PlusMark({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute z-10 block h-3.5 w-3.5 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(15,23,42,0.28)]" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-[rgba(15,23,42,0.28)]" />
    </span>
  );
}

export default function OurWaySection() {
  const { head, body } = homeV2.ourWay;
  const cells = [
    { label: '앱', text: body[0] },
    { label: '사람', text: body[1] },
  ];
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
              S3 — OUR WAY
            </span>
            <h2
              className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold text-text-primary tracking-[-0.03em] leading-[1.24] text-balance"
              dangerouslySetInnerHTML={{ __html: head }}
            />
          </div>

          {/* 2칸 대비 — 앱 ↔ 사람 */}
          <div className="grid grid-cols-2 max-md:grid-cols-1">
            {cells.map((c, i) => (
              <div
                key={i}
                className={`px-9 py-11 max-md:px-6 max-md:py-8 ${
                  i === 0 ? 'border-r border-border-light max-md:border-r-0 max-md:border-b' : ''
                }`}
              >
                <span className="text-[13px] font-bold tracking-[0.04em] text-accent">{c.label}</span>
                <p className="mt-4 text-[17px] max-md:text-[15px] text-text-body leading-[1.55] tracking-[-0.01em]">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
