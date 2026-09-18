import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import Accordion from '@/components/ui/Accordion';
import PricingCards from '@/components/ui/PricingCards';
import { pricingHero, planTiers, pricingFootnote, bundleNote, pricingFaq, freezePromise } from '@/lib/content/pricing';

export const metadata: Metadata = {
  title: '요금',
  // ★2026-09-18 §7 플랜 3단 반영에 맞춰 갱신(카피를 고치면 메타도 같이 — 개선안 §11)
  description:
    '누구나 콘텐츠 월 9.9만원, 콘텐츠 플러스 14.9만원, 콘텐츠 스튜디오 29.9만원부터, 누구나 광고 월 19.9만원. 광고비에 붙는 수수료 없이 월 정액. 30일 무료, 카드 등록 없음.',
};

export default function PricingPage() {
  return (
    <main>
      <OuterContainer>
        {/* Hero */}
        <Section crossMarks>
          <div className="py-20 px-10 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h1
                className="text-[clamp(48px,7vw,72px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.08] mb-5"
                style={{ fontFamily: 'var(--font-en)' }}
              >
                {pricingHero.title}
              </h1>
              <p className="text-[17px] text-text-body max-w-[520px] mx-auto leading-[1.6]">{pricingHero.sub}</p>
            </FadeUp>
          </div>
        </Section>

        {/* 실제 판매 범위가 확정된 두 상품만 표시한다. */}
        <Section crossMarks>
          <div className="py-16 px-12 max-md:py-10 max-md:px-6">
            <FadeUp>
              <PricingCards tiers={planTiers} footnote={pricingFootnote} featuredLabel="추천" />
              {/* ★2026-09-18 §7.4 묶음 — "요금표의 주인공으로 내세우지 않는다"는 지시에 따라
                  카드가 아니라 각주 아래 한 줄로만 둔다(각주보다 한 단계 더 여린 톤). */}
              <p className="mt-3 text-center text-[12.5px] leading-[1.6] text-text-muted">{bundleNote}</p>
            </FadeUp>
          </div>
        </Section>

        {/* FAQ */}
        <Section>
          <div className="py-20 px-12 max-md:py-12 max-md:px-6">
            <FadeUp>
              <div className="text-center mb-12">
                <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-text-primary tracking-[-0.04em]">
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

        {/* CTA — 동결 선언 (다크 = 선언부, grandfathering 확정 문구) */}
        <Section noBorder>
          <div className="py-24 px-12 text-center bg-[#0a0a0a] max-md:py-16 max-md:px-6">
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.03em] leading-[1.25] mb-5">
                {freezePromise.heading}
                <br />
                {freezePromise.headingLine2}
              </h2>
              <p className="text-[15px] text-white/55 leading-[1.6] mb-10 max-w-[480px] mx-auto">
                {freezePromise.body}
              </p>
              <Link
                href={freezePromise.cta.href}
                className="rounded-pill inline-flex items-center justify-center h-[52px] px-9 text-[15px] font-semibold bg-white text-text-primary hover:bg-[#e6e6e6] transition-all"
              >
                {freezePromise.cta.text}
              </Link>
              <p className="text-[13px] text-white/40 mt-5">{freezePromise.sub}</p>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
