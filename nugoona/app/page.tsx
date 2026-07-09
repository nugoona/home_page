import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import BeamCanvas from '@/components/home/BeamCanvas';
import DashboardGlimpse from '@/components/home/DashboardGlimpse';
import SearchResultMock from '@/components/content/SearchResultMock';
import { hero, structure, preview, story, closing } from '@/lib/content/home';

const EN = { fontFamily: 'var(--font-en)' } as const;

const ArrowLink = ({ href, text }: { href: string; text: string }) => (
  <Link href={href} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:gap-2.5 transition-all">
    {text}
    <span aria-hidden>&rarr;</span>
  </Link>
);

export default function Home() {
  return (
    <main>
      <OuterContainer>
        {/* H1 · 히어로 = 회사 브랜드·시대 선언 + 분기 카드 2 (다크, 점선면 §8.6 A) */}
        <Section noBorder>
          <div
            className="relative pt-40 pb-20 px-12 overflow-hidden max-md:pt-28 max-md:pb-16 max-md:px-6"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a30 0%, #0a0a0a 55%)' }}
          >
            <div className="dark-grid-pattern absolute inset-0 opacity-60 pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />
            {/* 실제 회로빔 (원본 HeroAurora 재활용) */}
            <BeamCanvas />

            <div className="relative z-[1] text-center max-w-[860px] mx-auto">
              <FadeUp>
                <h1 className="text-[clamp(34px,6.4vw,72px)] font-extrabold text-white tracking-[-0.04em] leading-[1.06]">
                  <span className="text-accent">누구나</span> 마케팅하는 시대
                </h1>
              </FadeUp>
            </div>

            <FadeUp delay={0.14} className="relative z-[1] block">
              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mt-16 max-w-[880px] mx-auto max-md:grid-cols-1">
                {hero.branches.map((b, i) => (
                  <Link
                    key={i}
                    href={b.cta.href}
                    className="group bg-[#0f0f0f] p-9 flex flex-col hover:bg-[#151515] transition-colors max-md:p-7"
                  >
                    <h2 className="text-[21px] font-semibold text-white mb-3">{b.title}</h2>
                    <p className="text-[14px] text-white/55 leading-[1.65] flex-1">{b.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent mt-6 group-hover:gap-2.5 transition-all">
                      {b.cta.text}
                      <span aria-hidden>&rarr;</span>
                    </span>
                  </Link>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* H2 · 공통 구조 — 왜 이제 직접이 가능한가 (숫자·금액 없음) */}
        <Section crossMarks>
          <div className="py-24 px-12 text-center max-md:py-16 max-md:px-6 max-w-[760px] mx-auto">
            <FadeUp>
              <h2 className="text-[clamp(26px,4vw,40px)] font-semibold text-text-primary tracking-[-0.025em] leading-[1.2]">
                {structure.heading}
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[17px] text-text-body leading-[1.8] mt-7">{structure.body}</p>
            </FadeUp>
          </div>
        </Section>

        {/* H3 · 두 제품 미리보기 ×2 (실제 목업 재활용) + 브리지 */}
        <Section alt>
          <div className="py-20 px-12 max-md:py-14 max-md:px-6 max-w-[1080px] mx-auto flex flex-col gap-16 max-md:gap-12">
            {/* 미리보기 1: 누구나 컨텐츠 — 검색 목업 */}
            <div className="grid grid-cols-2 gap-14 items-center max-md:grid-cols-1 max-md:gap-8">
              <FadeUp>
                <div>
                  <span className="text-[12px] font-semibold text-accent tracking-[0.05em] uppercase" style={EN}>{preview.content.label}</span>
                  <h3 className="text-[clamp(22px,3vw,30px)] font-semibold text-text-primary tracking-[-0.02em] mt-3 mb-3">{preview.content.heading}</h3>
                  <p className="text-[15px] text-text-body leading-[1.7]">{preview.content.body}</p>
                  <span className="inline-block mt-6"><ArrowLink href="/content" text="자세히 보기" /></span>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}><SearchResultMock /></FadeUp>
            </div>

            {/* 브리지 */}
            <FadeUp><p className="text-center text-[15px] text-text-muted">{preview.bridge}</p></FadeUp>

            {/* 미리보기 2: NGN 대시보드 — 실제 대시보드 목업(DashboardGlimpse 재활용) */}
            <div className="grid grid-cols-2 gap-14 items-center max-md:grid-cols-1 max-md:gap-8">
              <FadeUp>
                <div>
                  <span className="text-[12px] font-semibold text-accent tracking-[0.05em] uppercase" style={EN}>{preview.ads.label}</span>
                  <h3 className="text-[clamp(22px,3vw,30px)] font-semibold text-text-primary tracking-[-0.02em] mt-3 mb-3">{preview.ads.heading}</h3>
                  <p className="text-[15px] text-text-body leading-[1.7]">{preview.ads.body}</p>
                  <span className="inline-block mt-6"><ArrowLink href="/ads" text="자세히 보기" /></span>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}><DashboardGlimpse /></FadeUp>
            </div>
          </div>
        </Section>

        {/* H4 · 회사의 마음 (15년 → 진화·요금 동결) */}
        <Section crossMarks>
          <div className="py-24 px-12 text-center max-md:py-16 max-md:px-6 max-w-[760px] mx-auto">
            <FadeUp>
              <h2 className="text-[clamp(26px,4.2vw,42px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.18]">
                {story.heading}
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[17px] text-text-body leading-[1.8] mt-7">{story.body}</p>
            </FadeUp>
          </div>
        </Section>

        {/* H5 · 마감 (위험 제로 + 분기 버튼 2 + /start 소링크) — 다크 */}
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
            <FadeUp delay={0.08}>
              <p className="text-[16px] text-white/55 leading-[1.7] mt-5 max-w-[560px] mx-auto">{closing.body}</p>
            </FadeUp>
            <FadeUp delay={0.16}>
              <div className="flex justify-center gap-3 mt-10 max-sm:flex-col max-sm:items-center">
                {closing.buttons.map((b, i) => (
                  <Link
                    key={i}
                    href={b.href}
                    className={`inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold transition-all ${
                      i === 0
                        ? 'bg-white text-text-primary border border-white hover:bg-[#e0e0e0]'
                        : 'text-white/85 hover:bg-white/10'
                    }`}
                    style={i === 0 ? undefined : { border: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    {b.text}
                  </Link>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.24}>
              <p className="mt-8">
                <Link href={closing.startLink.href} className="text-[14px] text-white/50 hover:text-white/80 transition-colors underline underline-offset-4">
                  {closing.startLink.text}
                </Link>
              </p>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
