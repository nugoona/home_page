import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import PricingCards from '@/components/ui/PricingCards';
import DashboardShowcase from '@/components/features/DashboardShowcase';
import AdCanvasShowcase from '@/components/features/AdCanvasShowcase';
import TrendShowcase from '@/components/features/TrendShowcase';
import HeroDashboardMock from '@/components/ads/HeroDashboardMock';
import {
  hero, concept, chatbot, pricingIntro, evolve, closing,
} from '@/lib/content/ads';
import { adsTiers, pricingFootnote } from '@/lib/content/pricing';

export const metadata: Metadata = {
  title: 'NGN 대시보드 — AI 시대의 온라인 광고',
  description:
    '어려운 광고, 이제 이해하며 운영합니다. AI 챗봇으로 쉽게 묻고, 애드캔버스로 만들고, 흩어진 성과를 한 화면에서. 광고비에 붙는 수수료 없이.',
};

const EN = { fontFamily: 'var(--font-en)' } as const;

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[13px] font-medium tracking-[1.5px] uppercase mb-4 ${dark ? 'text-accent' : 'text-text-body'}`} style={EN}>
      {children}
    </p>
  );
}

function Heading({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2 className={`text-[clamp(26px,4vw,40px)] font-semibold tracking-[-0.025em] leading-[1.2] ${dark ? 'text-white' : 'text-text-primary'}`}>
      {children}
    </h2>
  );
}

export default function AdsPage() {
  return (
    <main>
      <OuterContainer>
        {/* S1 · 히어로 = 카테고리·시대 선언 (다크 셸 + 그리드·노이즈 점선면 + 대시보드 프리뷰) */}
        <Section noBorder>
          <div
            className="relative pt-40 pb-28 px-12 text-center overflow-hidden max-md:pt-28 max-md:pb-20 max-md:px-6"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a30 0%, #0a0a0a 55%)' }}
          >
            {/* 점·선·면: 다크 그리드 + 필름 노이즈 (§8.6 A) */}
            <div className="dark-grid-pattern absolute inset-0 opacity-60 pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            <div className="relative z-[1] max-w-[860px] mx-auto">
              <FadeUp>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/15 text-[12px] text-white/60 mb-8" style={EN}>
                  <span className="rounded-dot w-1.5 h-1.5 bg-accent" />
                  NGN 대시보드
                </span>
              </FadeUp>
              <FadeUp delay={0.06}>
                <h1 className="text-[clamp(34px,6vw,68px)] font-extrabold text-white tracking-[-0.04em] leading-[1.1]">
                  {hero.h1}
                </h1>
              </FadeUp>
              {/* §8.6 B: 콤마=.comma 세리프 · '이해'=accent 스팬 */}
              <FadeUp delay={0.14}>
                <p className="text-[18px] text-white/60 leading-[1.6] mt-6">
                  어려운 광고<span className="comma">,</span> 이제 <span className="text-accent">이해</span>하며 운영합니다.
                </p>
              </FadeUp>
              <FadeUp delay={0.22}>
                <div className="flex justify-center gap-3 mt-10 max-sm:flex-col max-sm:items-center">
                  <Link href={hero.cta.href} className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all">
                    {hero.cta.text}
                  </Link>
                  <Link href={hero.ctaSecondary.href} className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-medium text-white/80 hover:bg-white/10 transition-all" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
                    {hero.ctaSecondary.text}
                  </Link>
                </div>
                <p className="text-[13px] text-white/35 mt-4">{hero.cta.sub}</p>
              </FadeUp>

              {/* 실 대시보드 프리뷰 목업 (다크 히어로 위 라이트 카드) */}
              <FadeUp delay={0.3}>
                <div className="max-w-[560px] mx-auto mt-16">
                  <HeroDashboardMock />
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S3 · 콘셉트 인트로 "내 손안의 마케터" */}
        <Section crossMarks>
          <div className="py-20 px-12 text-center max-md:py-14 max-md:px-6 max-w-[720px] mx-auto">
            <FadeUp><Heading>{concept.heading}</Heading></FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[16px] text-text-body leading-[1.75] mt-6">{concept.sub}</p>
            </FadeUp>
          </div>
        </Section>

        {/* S4 · AI 챗봇 (최대 비중 · 다크 · 대화 목업) */}
        <Section noBorder>
          <div className="py-28 px-12 max-md:py-20 max-md:px-6" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}>
            <div className="max-w-[880px] mx-auto text-center">
              <FadeUp><Eyebrow dark>{chatbot.eyebrow}</Eyebrow></FadeUp>
              <FadeUp delay={0.08}><Heading dark>{chatbot.heading}</Heading></FadeUp>
              <FadeUp delay={0.14}>
                <p className="text-[17px] text-white/60 leading-[1.75] max-w-[640px] mx-auto mt-6">{chatbot.body}</p>
              </FadeUp>

              {/* 대화 목업 */}
              <FadeUp delay={0.2}>
                <div className="border border-white/10 bg-[#0f0f0f] mt-12 p-6 text-left max-w-[560px] mx-auto flex flex-col gap-3 max-md:p-4">
                  <ChatBubble side="user">이번 달 ROAS가 왜 떨어졌어?</ChatBubble>
                  <ChatBubble side="ai">지난주 전환이 줄어든 게 커요. ‘여름 신상’ 세트 광고비를 20% 줄여볼까요?</ChatBubble>
                  <ChatBubble side="user">응, 그렇게 해줘</ChatBubble>
                  <ChatBubble side="ai">확인을 누르면 바로 조정할게요. ✓ 예산 −20% 적용</ChatBubble>
                </div>
              </FadeUp>

              <FadeUp delay={0.26}>
                <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 mt-10 max-md:grid-cols-1 text-left">
                  {chatbot.points.map((p, i) => (
                    <div key={i} className="bg-[#0f0f0f] p-6">
                      <span className="text-[12px] font-semibold text-accent" style={EN}>{p.label}</span>
                      <h3 className="text-[16px] font-semibold text-white mt-2.5 mb-1.5">{p.title}</h3>
                      <p className="text-[13px] text-white/55 leading-[1.55]">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S5 · 애드캔버스 = AdCanvasShowcase 재활용 (§8.6 G — 4스텝 애니: 타이핑→AI스피너→게시·카탈로그·Ad Strength 게이지·토글) */}
        <AdCanvasShowcase />

        {/* S6·S7 · 통합 + 월간 리포트 = DashboardShowcase 재활용 (§8.6 G — 대시보드 제품 실화면·애니 SVG 파이프라인·매거진 AI리포트·iPhone) */}
        <DashboardShowcase />

        {/* S9 · 시장/트렌드 = TrendShowcase 재활용 (§8.6 G — 브리핑 테이블·AI인사이트·경쟁 상품그리드·검색량 애니 라인차트) */}
        <TrendShowcase />

        {/* [가격] · PricingCards (4티어) */}
        <Section>
          <div className="py-20 px-6 max-md:py-14">
            <FadeUp>
              <div className="text-center mb-12 px-6">
                <Heading>{pricingIntro.heading}</Heading>
                <p className="text-[15px] text-text-body mt-4">{pricingIntro.sub}</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <PricingCards tiers={adsTiers} footnote={pricingFootnote} />
            </FadeUp>
          </div>
        </Section>

        {/* S10 · 진화 선언 (다크) */}
        <Section noBorder>
          <div className="py-28 px-12 text-center max-md:py-20 max-md:px-6" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
            <div className="max-w-[720px] mx-auto">
              <FadeUp>
                <h2 className="text-[clamp(28px,4.4vw,44px)] font-bold text-white tracking-[-0.03em] leading-[1.18]">{evolve.heading}</h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="text-[16px] text-white/55 leading-[1.75] mt-6">{evolve.body}</p>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* S11 · 데모 + CTA + 크로스셀 (다크) */}
        <Section noBorder>
          <div className="py-24 px-12 text-center max-md:py-16 max-md:px-6" style={{ background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' }}>
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em]">{closing.heading}</h2>
            </FadeUp>
            <FadeUp delay={0.08}>
              <p className="text-[15px] text-white/55 leading-[1.7] mt-5 max-w-[560px] mx-auto">{closing.body}</p>
            </FadeUp>
            <FadeUp delay={0.16}>
              <div className="flex justify-center gap-3 mt-10 max-sm:flex-col max-sm:items-center">
                <Link href={closing.cta.href} className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all">
                  {closing.cta.text}
                </Link>
                <Link href={closing.ctaSecondary.href} className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-medium text-white/80 hover:bg-white/10 transition-all" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
                  {closing.ctaSecondary.text}
                </Link>
              </div>
              <p className="text-[13px] text-white/40 mt-4">{closing.cta.sub}</p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <p className="text-[14px] text-white/50 mt-10 pt-8 border-t border-white/10 max-w-[440px] mx-auto">
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

function ChatBubble({ side, children }: { side: 'user' | 'ai'; children: React.ReactNode }) {
  const isUser = side === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <span
        className={`inline-block max-w-[85%] px-4 py-2.5 text-[14px] leading-[1.5] ${
          isUser ? 'bg-accent text-white' : 'bg-white/10 text-white/90'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
