'use client';

import FadeUp from '@/components/motion/FadeUp';
import { homeV2 } from '@/lib/content/home';

/**
 * S6 · 자산 "남는 것은 사장님의 것이어야 합니다" — 2칸(콘텐츠 자산 / 광고 자산) 그리드.
 * 칸 그리드 문법(hairline + '+' 마커). 카피 = home.ts homeV2.asset (토씨 유지).
 * body[0]을 <br>로 나눠 콘텐츠·광고 두 칸, body[1]은 결론 칸.
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

export default function AssetSection() {
  const { head, body } = homeV2.asset;
  const cells = body[0].split(/<br\s*\/?>/);
  const conclusion = body[1];
  const labels = ['콘텐츠', '광고'];
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
              S6 — ASSET
            </span>
            <h2
              className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold text-text-primary tracking-[-0.03em] leading-[1.24] text-balance"
              dangerouslySetInnerHTML={{ __html: head }}
            />
          </div>

          {/* 2칸 — 콘텐츠 자산 / 광고 자산 */}
          <div className="grid grid-cols-2 border-b border-border-light max-md:grid-cols-1">
            {cells.map((c, i) => (
              <div
                key={i}
                className={`px-9 py-11 max-md:px-6 max-md:py-8 ${
                  i === 0 ? 'border-r border-border-light max-md:border-r-0 max-md:border-b' : ''
                }`}
              >
                <span className="text-[13px] font-bold tracking-[0.04em] text-accent">{labels[i]}</span>
                <p className="mt-4 text-[17px] max-md:text-[15px] text-text-primary leading-[1.5] tracking-[-0.01em]">
                  {c}
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
