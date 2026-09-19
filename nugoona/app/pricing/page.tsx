import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import Accordion from '@/components/ui/Accordion';
import PricingTabs from '@/components/ui/PricingTabs';
import { pricingHero, productHeads, contentTiers, adsTiers, pricingFootnote, pricingFaq, freezePromise } from '@/lib/content/pricing';

export const metadata: Metadata = {
  title: '요금',
  // ★2026-09-18 §7 플랜 3단 반영에 맞춰 갱신(카피를 고치면 메타도 같이 — 개선안 §11)
  description:
    '누구나 콘텐츠 월 9.9만원, 플러스 14.9만원, 광고 19.9만원. 30일 무료·카드 등록 없음. 스튜디오는 월 29.9만원부터 상담 후 시작. VAT·광고비 별도.',
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

        {/* ★2026-09-18 제품 탭으로 분리 (사장님 재판단 — 시안 3번. 1번(위아래 블록)에서 바꾼 것)
            구 구조 = 네 칸 한 줄 → 사장님 지적 "누구나 콘텐츠랑 누구나 광고는 **아예 다른 앱**인데
            4개를 붙여놓으니 하나의 앱에 4개 플랜처럼 보인다".
            탭을 고른 이유(사장님) = "광고 요금을 바로 알고 싶은 사람은 **스크롤을 안 해도** 되고,
            그렇게 하는 게 **확실히 더 위계가 있어 보인다**". 위아래로 쌓으면 모바일에서
            광고를 보려면 콘텐츠 카드 3장을 지나야 한다.
            ⚠ 숨기는 방식 주의 — 자세한 근거는 components/ui/PricingTabs.tsx 상단 주석.
            각주·묶음 안내는 두 제품을 모두 덮으므로 탭 바깥에 한 번만 둔다. */}
        <Section crossMarks>
          <div className="py-16 px-12 max-md:py-10 max-md:px-6">
            <FadeUp>
              <PricingTabs
                products={[
                  { key: 'content', ...productHeads.content, tiers: contentTiers, featuredLabel: '추천' },
                  { key: 'ads', ...productHeads.ads, tiers: adsTiers },
                ]}
              />
            </FadeUp>
            <FadeUp>
              <div className="mx-auto max-w-[1080px]">
                <p className="mt-8 text-center text-[13px] leading-[1.6] text-text-body">{pricingFootnote}</p>
              </div>
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
