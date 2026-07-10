'use client';

import Link from 'next/link';
import FadeUp from '@/components/motion/FadeUp';
import { branch } from '@/lib/content/home';
import SearchResultMock from '@/components/content/SearchResultMock';
import DashboardGlimpse from '@/components/home/DashboardGlimpse';

const EN = { fontFamily: 'var(--font-en)' } as const;

/**
 * S3 두 제품 분기 — 홈의 심장 (신규 조립)
 * 2열 카드: 노출(누구나 콘텐츠) / 광고(NGN 대시보드). 각 카드 상단 = 실제 제품 미니목업 재활용.
 */
export default function ProductBranch() {
  return (
    <div className="py-[100px] px-12 max-md:py-16 max-md:px-6">
      <FadeUp>
        <div className="text-center mb-14 max-md:mb-10">
          <h2
            className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.15] mb-4"
            dangerouslySetInnerHTML={{ __html: branch.title }}
          />
          <p className="text-[16px] text-text-body">{branch.sub}</p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-2 gap-6 max-w-[1080px] mx-auto max-md:grid-cols-1">
        {branch.cards.map((c, i) => (
          <FadeUp key={c.href} delay={i * 0.1}>
            <Link
              href={c.href}
              className="group flex flex-col h-full border border-border-default bg-white overflow-hidden transition-all duration-300 hover:border-border-hover hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              {/* 미니 목업 (상단 크롭) */}
              <div className="relative h-[248px] overflow-hidden bg-bg-alt border-b border-border-default max-md:h-[220px]">
                <div className="absolute left-6 right-6 top-7 transition-transform duration-500 group-hover:-translate-y-2">
                  {c.mock === 'search' ? (
                    <SearchResultMock />
                  ) : (
                    <div className="origin-top scale-[0.62] max-md:scale-[0.7]">
                      <DashboardGlimpse />
                    </div>
                  )}
                </div>
                {/* 하단 페이드 */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-alt to-transparent" />
              </div>

              {/* 텍스트 */}
              <div className="p-7 flex flex-col flex-1 max-md:p-6">
                <p className="text-[11px] font-semibold text-text-weak tracking-[0.1em] uppercase mb-3" style={EN}>
                  {c.eyebrow}
                </p>
                <h3
                  className="text-[clamp(20px,2.4vw,26px)] font-semibold text-text-primary tracking-[-0.02em] leading-[1.25] mb-3"
                  dangerouslySetInnerHTML={{ __html: c.title }}
                />
                <p className="text-[14px] text-text-body leading-[1.6] mb-6 flex-1">{c.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-[14px] text-accent font-medium group-hover:gap-2.5 transition-[gap] duration-150">
                  {c.cta}
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </Link>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
