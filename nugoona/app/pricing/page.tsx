import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import Accordion from '@/components/ui/Accordion';
import PricingCards from '@/components/ui/PricingCards';
import { pricingHero, productHeads, contentTiers, adsTiers, pricingFootnote, bundleNote, pricingFaq, freezePromise } from '@/lib/content/pricing';

export const metadata: Metadata = {
  title: '요금',
  // ★2026-09-18 §7 플랜 3단 반영에 맞춰 갱신(카피를 고치면 메타도 같이 — 개선안 §11)
  description:
    '누구나 콘텐츠 월 9.9만원, 콘텐츠 플러스 14.9만원, 콘텐츠 스튜디오 29.9만원부터, 누구나 광고 월 19.9만원. 광고비에 붙는 수수료 없이 월 정액. 30일 무료, 카드 등록 없음.',
};

/** 제품 머리 — 로고를 크게 세워 두 앱의 경계를 만든다.
 *  크기 = DESIGN §1 "PC 40px·모바일 32px". §8.17 "로고는 작게 쓰지 말 것". */
function ProductHead({ logo, name, note }: { logo: string; name: string; note: string }) {
  return (
    <div className="flex items-start gap-3.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" width={40} height={40} className="shrink-0 max-md:h-8 max-md:w-8" style={{ width: 40, height: 40 }} />
      <div className="min-w-0">
        <p className="text-[clamp(19px,2.2vw,24px)] font-bold leading-[1.25] tracking-[-0.03em] text-text-primary">{name}</p>
        <p className="mt-1 text-[14px] font-medium leading-[1.55] text-text-body">{note}</p>
      </div>
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
                className="text-[clamp(48px,7vw,72px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.08] mb-5"
                style={{ fontFamily: 'var(--font-en)' }}
              >
                {pricingHero.title}
              </h1>
              <p className="text-[17px] text-text-body max-w-[520px] mx-auto leading-[1.6]">{pricingHero.sub}</p>
            </FadeUp>
          </div>
        </Section>

        {/* ★2026-09-18 제품별 블록으로 분리(사장님 낙점 시안 1번).
            구 구조 = 네 칸 한 줄 → 사장님 지적 "누구나 콘텐츠랑 누구나 광고는 아예 다른 앱인데
            4개를 붙여놓으니 하나의 앱에 4개 플랜처럼 보인다".
            각 블록 머리에 NC/NA 로고를 크게 세워 경계를 만든다(DESIGN §1·§8.17).
            각주·묶음 안내는 두 블록을 모두 덮으므로 맨 아래에 한 번만 둔다. */}
        <Section crossMarks>
          <div className="py-16 px-12 max-md:py-10 max-md:px-6">
            <div className="mx-auto max-w-[1080px]">
              <FadeUp>
                <ProductHead {...productHeads.content} />
              </FadeUp>
              <div className="mt-6">
                <FadeUp><PricingCards tiers={contentTiers} featuredLabel="추천" /></FadeUp>
              </div>

              {/* 제품 경계 = 굵은 여백 + 얇은 선 하나. 선을 진하게 하지 않고 '끊김'으로 나눈다(§8.17 선 1px 고정) */}
              <div className="my-14 h-px w-full bg-border-default max-md:my-10" />

              <FadeUp>
                <ProductHead {...productHeads.ads} />
              </FadeUp>
              <div className="mt-6">
                <FadeUp><PricingCards tiers={adsTiers} /></FadeUp>
              </div>

              <FadeUp>
                <p className="mt-7 text-center text-[13px] leading-[1.6] text-text-body">{pricingFootnote}</p>
                {/* ★§7.4 묶음 — "요금표의 주인공으로 내세우지 않는다"는 지시에 따라
                    카드가 아니라 각주 아래 한 줄로만 둔다(각주보다 한 단계 더 여린 톤). */}
                <p className="mt-3 text-center text-[12.5px] leading-[1.6] text-text-muted">{bundleNote}</p>
              </FadeUp>
            </div>
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
