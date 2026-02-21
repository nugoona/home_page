import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import Accordion from '@/components/ui/Accordion';
import { plans, comparisonTable, pricingFaq, pricingHero } from '@/lib/content/pricing';

export const metadata: Metadata = {
  title: '요금',
  description:
    'NGN Dashboard 월 9.9만원, NGN Business 월 29.9만원. 광고비 대비 수수료 없이 월정액으로 이용하세요.',
};

export default function PricingPage() {
  return (
    <main>
      <OuterContainer>
        {/* Hero */}
        <Section crossMarks>
          <div className="py-20 px-10 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h1 className="text-[clamp(48px,7vw,72px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.08] mb-5" style={{ fontFamily: 'var(--font-en)' }}>
                {pricingHero.title}
              </h1>
              <p className="text-[17px] text-text-body max-w-[520px] mx-auto leading-[1.6]">{pricingHero.sub}</p>
            </FadeUp>
          </div>
        </Section>

        {/* Plan cards */}
        <Section>
          <FadeUp>
            <div className="grid grid-cols-3 max-md:grid-cols-1">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className="relative p-10 flex flex-col border-r border-border-default last:border-r-0 transition-colors hover:bg-bg-alt max-md:border-r-0 max-md:border-b max-md:border-border-default max-md:last:border-b-0"
                >
                  {plan.badge && (
                    <span className="absolute top-[-13px] left-1/2 -translate-x-1/2 z-[3] text-[13px] font-semibold text-white bg-black px-5 py-1.5 tracking-[0.02em]">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-[22px] font-semibold text-text-primary tracking-[-0.01em] mb-4">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-[48px] font-extrabold text-text-primary tracking-[-0.03em] leading-none" style={{ fontFamily: 'var(--font-en)' }}>
                      {plan.price}
                    </span>
                    <span className="text-[15px] text-text-body ml-0.5">{plan.unit}</span>
                  </div>
                  <p className="text-[13px] text-text-muted mb-4">{plan.vat}</p>
                  <p className="text-[15px] text-[#444] leading-[1.6] mb-6 min-h-[48px]">{plan.desc}</p>
                  <Link
                    href="/start"
                    className={`block text-center py-3 px-5 text-[14px] font-semibold mb-7 transition-all ${
                      plan.ctaVariant === 'solid'
                        ? 'bg-black text-white border border-black hover:bg-[#333]'
                        : 'bg-white text-[#444] border border-border-default hover:bg-bg-alt hover:border-border-hover hover:text-black'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[14px] text-[#444] leading-[1.5]">
                        <svg className="w-[18px] h-[18px] shrink-0 mt-[1px] text-text-secondary" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 9l3 3 7-7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  {plan.note && (
                    <p className="text-[12px] text-text-muted mt-5 pt-4 border-t border-border-default">{plan.note}</p>
                  )}
                </div>
              ))}
            </div>
          </FadeUp>
        </Section>

        {/* Feature comparison table */}
        <Section alt crossMarks>
          <div className="py-20 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[13px] font-medium text-text-body tracking-[1.5px] uppercase mb-3.5" style={{ fontFamily: 'var(--font-en)' }}>
                  Compare
                </p>
                <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.025em]">
                  플랜별 기능 비교
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="max-w-[1080px] mx-auto overflow-x-auto">
                <table className="w-full border border-border-default border-spacing-0 overflow-hidden min-w-[600px]">
                  <thead>
                    <tr>
                      {comparisonTable.headers.map((h, i) => (
                        <th key={i} className="bg-bg-alt text-text-body font-semibold text-[12px] tracking-[0.3px] border-b border-border-default py-3.5 px-5 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.rows.map((row, i) => (
                      <tr key={i} className="transition-colors hover:bg-bg-alt">
                        {row.map((cell, j) => (
                          <td key={j} className={`py-3 px-5 text-[13px] border-b border-border-light ${
                            j === 0 ? 'text-text-primary font-medium' : cell === '✓' ? 'text-accent font-semibold' : 'text-text-weak'
                          }`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Callout */}
        <Section id="small-biz" crossMarks>
          <div className="py-16 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="max-w-[1080px] mx-auto p-7 px-9 border border-dashed border-border-hover bg-bg-alt flex items-center justify-between gap-8 max-md:flex-col max-md:text-center">
                <div>
                  <h3 className="text-[17px] font-semibold text-text-primary mb-1.5">소상공인 전용 프로그램</h3>
                  <p className="text-[14px] text-text-body">월 광고비 200만원 이하 사업자를 위한 월 3.9만원 특별 요금</p>
                </div>
                <Link href="/start" className="inline-flex items-center h-10 px-6 text-[13px] font-semibold btn-gradient-dark text-white shrink-0">
                  문의하기
                </Link>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* FAQ */}
        <Section alt>
          <div className="py-20 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-text-primary tracking-[-0.02em]">
                  자주 묻는 질문
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="max-w-[720px] mx-auto">
                <Accordion items={pricingFaq} />
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* CTA */}
        <Section noBorder>
          <div className="py-20 px-12 text-center max-md:py-16 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
          >
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] mb-3">
                지금 시작하면 첫 달 무료
              </h2>
              <p className="text-[15px] text-white/50 mb-10">카드 등록 없이 시작</p>
              <Link href="/start" className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all">
                무료 체험 시작
              </Link>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
