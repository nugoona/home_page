import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import PricingCards from '@/components/ui/PricingCards';
import { contentTiers, adsTiers, pricingFootnote } from '@/lib/content/pricing';
import { pricingIntro as contentPricing } from '@/lib/content/content';
import { pricingIntro as adsPricing } from '@/lib/content/ads';

export const metadata: Metadata = {
  title: '요금',
  description:
    '누구나 컨텐츠·NGN 대시보드 요금 — 월정액, 광고비에 붙는 수수료 없음, 1개월 무료·카드 등록 없음.',
};

function GroupHeader({ eyebrow, heading, sub }: { eyebrow: string; heading: string; sub?: string }) {
  return (
    <div className="text-center mb-12 px-6">
      <p
        className="text-[13px] font-medium text-text-body tracking-[1.5px] uppercase mb-3.5"
        style={{ fontFamily: 'var(--font-en)' }}
      >
        {eyebrow}
      </p>
      <h2 className="text-[clamp(26px,4vw,38px)] font-semibold text-text-primary tracking-[-0.025em] leading-[1.2]">
        {heading}
      </h2>
      {sub && <p className="text-[15px] text-text-body mt-4">{sub}</p>}
    </div>
  );
}

export default function PricingPage() {
  return (
    <main>
      <OuterContainer>
        {/* Hero */}
        <Section crossMarks>
          <div className="py-20 px-10 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h1
                className="text-[clamp(40px,7vw,64px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.08] mb-5"
                style={{ fontFamily: 'var(--font-en)' }}
              >
                Pricing
              </h1>
              <p className="text-[17px] text-text-body max-w-[560px] mx-auto leading-[1.6]">
                월정액 하나로. 광고비에 붙는 수수료는 없습니다.
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* 누구나 컨텐츠 — 2티어 */}
        <Section>
          <div className="py-16 max-md:py-12">
            <FadeUp>
              <GroupHeader eyebrow="누구나 컨텐츠" heading={contentPricing.heading} sub={contentPricing.sub} />
            </FadeUp>
            <FadeUp delay={0.1}>
              <PricingCards tiers={contentTiers} hook={contentPricing.hook} />
            </FadeUp>
          </div>
        </Section>

        {/* NGN 대시보드 — 4티어 */}
        <Section alt>
          <div className="py-16 max-md:py-12">
            <FadeUp>
              <GroupHeader eyebrow="NGN 대시보드" heading={adsPricing.heading} sub={adsPricing.sub} />
            </FadeUp>
            <FadeUp delay={0.1}>
              <PricingCards tiers={adsTiers} footnote={pricingFootnote} />
            </FadeUp>
          </div>
        </Section>

        {/* CTA */}
        <Section noBorder>
          <div
            className="py-20 px-12 text-center max-md:py-16 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
          >
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] mb-3">
                한 달 무료로 먼저 써 보세요
              </h2>
              <p className="text-[15px] text-white/50 mb-10">카드 등록 없이 시작합니다</p>
              <Link
                href="/start"
                className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all"
              >
                무료로 시작하기
              </Link>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
