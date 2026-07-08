import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import PricingCards from '@/components/ui/PricingCards';
import SearchResultMock from '@/components/content/SearchResultMock';
import MultiChannelMock from '@/components/content/MultiChannelMock';
import NewsReflectMock from '@/components/content/NewsReflectMock';
import ProofMock from '@/components/content/ProofMock';
import PrefillMock from '@/components/content/PrefillMock';
import {
  hero, market, bridge, multiChannel, newsReflect, place,
  proof, easyStart, featureGrid, pricingIntro, evolve, closing,
} from '@/lib/content/content';
import { contentTiers, pricingFootnote } from '@/lib/content/pricing';

export const metadata: Metadata = {
  title: '누구나 컨텐츠 — 검색에 쌓이는 노출',
  description:
    '광고는 멈추면 사라지지만, 꾸준히 쌓은 글은 검색에 남아 스토어를 계속 보이게 합니다. 전 채널 자동 발행·노출 소식 자동 반영·네이버·구글 플레이스까지.',
};

const EN = { fontFamily: 'var(--font-en)' } as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-medium text-text-body tracking-[1.5px] uppercase mb-4" style={EN}>
      {children}
    </p>
  );
}

function Heading({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2
      className={`text-[clamp(26px,4vw,40px)] font-semibold tracking-[-0.025em] leading-[1.2] ${
        dark ? 'text-white' : 'text-text-primary'
      }`}
    >
      {children}
    </h2>
  );
}

export default function ContentPage() {
  return (
    <main>
      <OuterContainer>
        {/* S1 · 히어로 (라이트, 선언) */}
        <Section noBorder>
          <div className="pt-40 pb-24 px-6 text-center max-md:pt-28 max-md:pb-16">
            <FadeUp>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 border border-border-default text-[12px] text-text-body mb-8"
                style={EN}
              >
                <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
                누구나 컨텐츠
              </span>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(30px,5.4vw,56px)] font-extrabold text-text-primary tracking-[-0.035em] leading-[1.12] max-w-[840px] mx-auto">
                {hero.h1}
              </h1>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p className="text-[17px] text-text-body leading-[1.7] max-w-[600px] mx-auto mt-7">
                {hero.sub}
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex justify-center gap-3 mt-10 max-sm:flex-col max-sm:items-center">
                <Link
                  href={hero.cta.href}
                  className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-[#171717] text-white border border-[#171717] hover:bg-[#333] transition-colors"
                >
                  {hero.cta.text}
                </Link>
                <Link
                  href={hero.ctaSecondary.href}
                  className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-medium text-text-body border border-border-default hover:bg-bg-alt transition-colors"
                >
                  {hero.ctaSecondary.text}
                </Link>
              </div>
              <p className="text-[13px] text-text-muted mt-4">{hero.cta.sub}</p>
            </FadeUp>
            <FadeUp delay={0.32}>
              <div className="max-w-[500px] mx-auto mt-20 max-md:mt-14">
                <SearchResultMock />
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* S2 · 시장현실 (alt, 텍스트+대비 — 비교표 없음) */}
        <Section alt crossMarks>
          <div className="py-20 px-12 max-md:py-14 max-md:px-6 max-w-[840px] mx-auto text-center">
            <FadeUp>
              <Heading>{market.heading}</Heading>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[16px] text-text-body leading-[1.75] mt-6">{market.body}</p>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="text-[16px] text-text-body leading-[1.75] mt-4">{market.body2}</p>
            </FadeUp>
          </div>
        </Section>

        {/* S3 · 정공법 브리지 (3카드 직각) */}
        <Section>
          <div className="py-20 px-12 max-md:py-14 max-md:px-6">
            <FadeUp>
              <div className="text-center mb-12">
                <Heading>{bridge.heading}</Heading>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="grid grid-cols-3 border border-border-default max-md:grid-cols-1">
                {bridge.cards.map((c, i) => (
                  <div
                    key={i}
                    className="p-8 border-r border-border-default last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0"
                  >
                    <span className="text-[13px] font-semibold text-accent" style={EN}>{c.label}</span>
                    <h3 className="text-[18px] font-semibold text-text-primary mt-3 mb-2">{c.title}</h3>
                    <p className="text-[14px] text-text-body leading-[1.6]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* S4 · 전 채널 발행 — FeatureSection 2열 (텍스트 + 제품 목업) */}
        <Section alt>
          <div className="py-24 px-12 max-md:py-14 max-md:px-6">
            <div className="grid grid-cols-2 gap-16 items-center max-w-[1080px] mx-auto max-md:grid-cols-1 max-md:gap-10">
              <FadeUp>
                <div>
                  <Heading>{multiChannel.heading}</Heading>
                  <p className="text-[16px] text-text-body leading-[1.75] mt-5">{multiChannel.body}</p>
                  <div className="flex flex-col gap-4 mt-8">
                    {multiChannel.steps.map((s, i) => (
                      <div key={i} className="flex gap-3.5">
                        <span className="shrink-0 w-7 h-7 flex items-center justify-center border border-border-default text-[12px] font-semibold text-accent bg-white" style={EN}>{s.num}</span>
                        <div>
                          <h3 className="text-[15px] font-semibold text-text-primary">{s.title}</h3>
                          <p className="text-[13px] text-text-body leading-[1.55] mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 border border-accent-border bg-accent-bg text-[13px] font-medium text-accent mt-8">
                    {multiChannel.badge}
                  </span>
                </div>
              </FadeUp>
              <FadeUp delay={0.12}>
                <MultiChannelMock />
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S5 · 노출 소식 자동 반영 (킬러 · XL · 다크) */}
        <Section noBorder>
          <div
            className="py-28 px-12 max-md:py-20 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
          >
            <div className="max-w-[1000px] mx-auto text-center">
              <FadeUp>
                <Eyebrow>{newsReflect.eyebrow}</Eyebrow>
              </FadeUp>
              <FadeUp delay={0.08}>
                <Heading dark>{newsReflect.heading}</Heading>
              </FadeUp>
              <FadeUp delay={0.14}>
                <p className="text-[17px] text-white/70 leading-[1.75] max-w-[640px] mx-auto mt-6">
                  {newsReflect.body}
                </p>
                <p className="text-[16px] text-white/50 leading-[1.7] max-w-[640px] mx-auto mt-3">
                  {newsReflect.body2}
                </p>
              </FadeUp>
              <FadeUp delay={0.2}>
                <div className="max-w-[760px] mx-auto mt-12">
                  <NewsReflectMock />
                </div>
              </FadeUp>
              <FadeUp delay={0.26}>
                <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 mt-6 max-md:grid-cols-1">
                  {newsReflect.points.map((p, i) => (
                    <div key={i} className="bg-[#0f0f0f] p-8 text-left">
                      <span className="text-[13px] font-semibold text-accent" style={EN}>{p.label}</span>
                      <h3 className="text-[18px] font-semibold text-white mt-3 mb-2">{p.title}</h3>
                      <p className="text-[14px] text-white/55 leading-[1.6]">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S6 · 플레이스 (지도 목업 + 텍스트) */}
        <Section crossMarks>
          <div className="py-20 px-12 max-md:py-14 max-md:px-6">
            <div className="grid grid-cols-2 gap-12 items-center max-md:grid-cols-1 max-w-[1080px] mx-auto">
              <FadeUp>
                <div>
                  <Heading>{place.heading}</Heading>
                  <p className="text-[16px] text-text-body leading-[1.75] mt-6">{place.body}</p>
                  <p className="text-[16px] text-text-body leading-[1.75] mt-4">{place.body2}</p>
                </div>
              </FadeUp>
              <FadeUp delay={0.12}>
                <MapMock />
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S7 · 노출 증명 = FeatureSection 2열 (텍스트 + 순위추적 목업) */}
        <Section alt>
          <div className="py-24 px-12 max-md:py-14 max-md:px-6">
            <div className="grid grid-cols-2 gap-16 items-center max-w-[1080px] mx-auto max-md:grid-cols-1 max-md:gap-10">
              <FadeUp>
                <div>
                  <Heading>{proof.heading}</Heading>
                  <div className="flex flex-col gap-5 mt-8">
                    {proof.cards.map((c, i) => (
                      <div key={i} className="border-l-2 border-accent pl-4">
                        <span className="text-[12px] font-semibold text-accent tracking-[0.05em]" style={EN}>{c.label}</span>
                        <h3 className="text-[16px] font-semibold text-text-primary mt-1 mb-1">{c.title}</h3>
                        <p className="text-[14px] text-text-body leading-[1.6]">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.12}>
                <ProofMock />
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S8 · 시작 부담 제로 = FeatureSection 2열 (텍스트 + 프리필 목업) */}
        <Section>
          <div className="py-24 px-12 max-md:py-14 max-md:px-6">
            <div className="grid grid-cols-2 gap-16 items-center max-w-[1080px] mx-auto max-md:grid-cols-1 max-md:gap-10">
              <FadeUp>
                <div>
                  <Heading>{easyStart.heading}</Heading>
                  <div className="mt-8 flex flex-col gap-6">
                    <div>
                      <h3 className="text-[17px] font-semibold text-text-primary mb-2">{easyStart.prefill.title}</h3>
                      <p className="text-[15px] text-text-body leading-[1.7]">{easyStart.prefill.body}</p>
                    </div>
                    <div>
                      <h3 className="text-[17px] font-semibold text-text-primary mb-2">{easyStart.topics.title}</h3>
                      <p className="text-[15px] text-text-body leading-[1.7]">{easyStart.topics.body}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.12}>
                <PrefillMock />
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S9 · 기능 그리드 */}
        <Section alt crossMarks>
          <div className="py-20 px-12 max-md:py-14 max-md:px-6 max-w-[1080px] mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <Heading>{featureGrid.heading}</Heading>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="grid grid-cols-3 border-t border-l border-border-default bg-white max-md:grid-cols-1">
                {featureGrid.items.map((it, i) => (
                  <div key={i} className="p-6 border-r border-b border-border-default">
                    <h3 className="text-[15px] font-semibold text-text-primary mb-1.5">{it.title}</h3>
                    <p className="text-[13px] text-text-body leading-[1.55]">{it.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* [가격] · PricingCards (2티어) */}
        <Section>
          <div className="py-20 px-6 max-md:py-14">
            <FadeUp>
              <div className="text-center mb-12 px-6">
                <Heading>{pricingIntro.heading}</Heading>
                <p className="text-[15px] text-text-body mt-4">{pricingIntro.sub}</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <PricingCards tiers={contentTiers} footnote={pricingFootnote} hook={pricingIntro.hook} />
            </FadeUp>
          </div>
        </Section>

        {/* S10 · 진화 선언 (다크, 큰 타이포) */}
        <Section noBorder>
          <div
            className="py-28 px-12 text-center max-md:py-20 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}
          >
            <div className="max-w-[720px] mx-auto">
              <FadeUp>
                <h2 className="text-[clamp(28px,4.4vw,44px)] font-bold text-white tracking-[-0.03em] leading-[1.18]">
                  {evolve.heading}
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-[16px] text-white/55 leading-[1.75] mt-6">{evolve.body}</p>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S11 · 마감 CTA + 크로스셀 (다크) */}
        <Section noBorder>
          <div
            className="py-24 px-12 text-center max-md:py-16 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' }}
          >
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em]">
                {closing.heading}
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex justify-center mt-10">
                <Link
                  href={closing.cta.href}
                  className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all"
                >
                  {closing.cta.text}
                </Link>
              </div>
              <p className="text-[13px] text-white/40 mt-4">{closing.cta.sub}</p>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-[14px] text-white/50 mt-10 pt-8 border-t border-white/10 max-w-[420px] mx-auto">
                {closing.crossSell.text}{' '}
                <Link href={closing.crossSell.cta.href} className="text-white font-medium hover:underline">
                  {closing.crossSell.cta.text} &rarr;
                </Link>
              </p>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}

/* S6 지도 목업 — 외부 지도 API·이미지 금지, CSS 추상 지도 (네이버·구글 플레이스 핀) */
function MapMock() {
  return (
    <div className="border border-border-default bg-white overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border-default bg-bg-alt">
        <span className="rounded-dot w-2.5 h-2.5 bg-[#e0e0e0]" />
        <span className="rounded-dot w-2.5 h-2.5 bg-[#e0e0e0]" />
        <span className="rounded-dot w-2.5 h-2.5 bg-[#e0e0e0]" />
        <span className="text-[11px] text-text-muted ml-2" style={EN}>map.search</span>
      </div>
      <div
        className="relative h-[280px] max-md:h-[220px]"
        style={{
          backgroundColor: '#f5f5f5',
          backgroundImage:
            'linear-gradient(#ebebeb 1px, transparent 1px), linear-gradient(90deg, #ebebeb 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* 도로 느낌 라인 */}
        <div className="absolute left-0 right-0 top-[40%] h-[6px] bg-[#e6e6e6]" />
        <div className="absolute top-0 bottom-0 left-[55%] w-[6px] bg-[#e6e6e6]" />

        {/* 네이버 핀 */}
        <Pin left="30%" top="34%" color="#03c75a" label="네이버 플레이스" />
        {/* 구글 핀 */}
        <Pin left="62%" top="58%" color="#4285f4" label="구글 지도" />
      </div>
    </div>
  );
}

function Pin({ left, top, color, label }: { left: string; top: string; color: string; label: string }) {
  return (
    <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full" style={{ left, top }}>
      <span className="whitespace-nowrap text-[11px] font-semibold text-text-primary bg-white border border-border-default px-2 py-0.5 mb-1 shadow-sm">
        {label}
      </span>
      <span className="rounded-dot w-4 h-4 border-2 border-white shadow-md" style={{ background: color }} />
    </div>
  );
}
