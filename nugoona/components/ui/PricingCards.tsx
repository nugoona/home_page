import Link from 'next/link';
import type { PricingTier, CrossSell } from '@/lib/content/types';

/**
 * 가격 티어 카드 (재사용) — /content 2티어·/ads 4티어 공용. (E3-4)
 * 데이터 = lib/content/pricing.ts (contentTiers·adsTiers). 헤드라인은 각 페이지 pricingIntro.
 * DESIGN 준수: 직각(모서리 0)·토큰 클래스만·1200px 이내·featured=파란 액센트(옅은 회색선 금지).
 */
export default function PricingCards({
  tiers,
  footnote,
  hook,
}: {
  tiers: PricingTier[];
  footnote?: string;
  hook?: CrossSell;
}) {
  // 티어 수에 따라 열 수 가변 (Tailwind JIT용 리터럴 클래스)
  const cols =
    tiers.length === 2
      ? 'md:grid-cols-2'
      : tiers.length === 4
        ? 'md:grid-cols-4'
        : 'md:grid-cols-3';

  return (
    <div className="max-w-[1080px] mx-auto">
      <div className={`grid grid-cols-1 ${cols} border border-border-default`}>
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={`relative p-8 flex flex-col border-r border-border-default last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0 transition-colors max-md:px-6 ${
              tier.featured ? 'bg-bg-alt' : 'hover:bg-bg-alt'
            }`}
          >
            {tier.featured && (
              <>
                <span className="absolute top-0 left-0 right-0 h-[3px] bg-accent" />
                <span className="absolute top-[-13px] left-1/2 -translate-x-1/2 z-[3] text-[12px] font-semibold text-white bg-accent px-4 py-1 tracking-[0.02em]">
                  추천
                </span>
              </>
            )}

            <h3 className="text-[20px] font-semibold text-text-primary tracking-[-0.01em] mb-1">
              {tier.name}
            </h3>
            <p className="text-[13px] text-text-muted mb-5">{tier.tagline}</p>

            <div className="mb-6 min-h-[44px]">
              <span
                className="text-[clamp(20px,2.1vw,30px)] font-extrabold text-text-primary tracking-[-0.02em] leading-[1.15]"
                style={{ fontFamily: 'var(--font-en)' }}
              >
                {tier.price}
              </span>
              {tier.priceUnit && (
                <span className="text-[14px] text-text-body ml-1">{tier.priceUnit}</span>
              )}
            </div>

            <Link
              href={tier.cta.href}
              className={`block text-center py-3 px-5 text-[14px] font-semibold mb-7 transition-all ${
                tier.featured
                  ? 'bg-accent text-white border border-accent hover:opacity-90'
                  : 'bg-white text-[#444] border border-border-default hover:bg-bg-alt hover:border-border-hover hover:text-black'
              }`}
            >
              {tier.cta.text}
            </Link>

            <ul className="flex flex-col gap-3 flex-1">
              {tier.features.map((feat, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-[14px] text-[#444] leading-[1.5]"
                >
                  <svg
                    className={`w-[18px] h-[18px] shrink-0 mt-[1px] ${tier.featured ? 'text-accent' : 'text-text-secondary'}`}
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 9l3 3 7-7" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            {tier.cta.sub && (
              <p className="text-[12px] text-text-muted mt-5">{tier.cta.sub}</p>
            )}
          </div>
        ))}
      </div>

      {footnote && (
        <p className="text-[13px] text-text-body text-center mt-7">{footnote}</p>
      )}

      {hook && (
        <p className="text-[14px] text-text-body text-center mt-4">
          {hook.text}{' '}
          <Link href={hook.cta.href} className="text-accent font-medium hover:underline">
            {hook.cta.text} &rarr;
          </Link>
        </p>
      )}
    </div>
  );
}
