import type { Metadata } from 'next';
import Link from 'next/link';
import OuterContainer from '@/components/layout/OuterContainer';
import Section from '@/components/layout/Section';
import FadeUp from '@/components/motion/FadeUp';
import AdCanvasShowcase from '@/components/features/AdCanvasShowcase';
import DashboardShowcase from '@/components/features/DashboardShowcase';
import TrendShowcase from '@/components/features/TrendShowcase';

export const metadata: Metadata = {
  title: '기능 소개',
  description:
    'AdCanvas로 메타·구글 광고를 직접 만들고 관리하세요. Dashboard로 매출·광고·방문자 데이터를 한 화면에서. Trend로 경쟁사 베스트를 추적하세요.',
};

export default function FeaturesPage() {
  return (
    <main>
      <OuterContainer>
        {/* Hero */}
        <Section crossMarks>
          <div className="py-20 px-12 text-center max-md:py-14 max-md:px-6">
            <FadeUp>
              <h1
                className="text-[clamp(48px,7vw,72px)] font-semibold text-text-primary tracking-[-0.03em] leading-[1.08] mb-5"
                style={{ fontFamily: 'var(--font-en)' }}
              >
                Features
              </h1>
              <p className="text-[18px] text-text-body">NGN이 제공하는 모든 것</p>
            </FadeUp>
          </div>
        </Section>

        {/* AdCanvas — Sticky Scroll Morphing */}
        <AdCanvasShowcase />

        {/* Dashboard — 3D Interactive Cards */}
        <DashboardShowcase />

        {/* Trend — Interactive Bento Grid */}
        <TrendShowcase />

        {/* CTA */}
        <Section alt noBorder>
          <div
            className="py-20 px-12 text-center max-md:py-16 max-md:px-6"
            style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #151515 100%)' }}
          >
            <FadeUp>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-white tracking-[-0.02em] mb-3">
                지금 시작하면 첫 달 무료
              </h2>
              <p className="text-[15px] text-white/50 mb-10">선착순 10개 업체 한정</p>
              <div className="flex justify-center gap-3 max-sm:flex-col max-sm:items-center">
                <Link
                  href="/start"
                  className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-white text-text-primary border border-white hover:bg-[#e0e0e0] transition-all"
                >
                  무료로 시작하기
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center h-[52px] px-8 text-[15px] font-semibold bg-transparent text-white/75 border border-white/20 hover:bg-white/[0.06] transition-all max-sm:w-full max-sm:max-w-[320px]"
                >
                  요금제 보기
                </Link>
              </div>
            </FadeUp>
          </div>
        </Section>
      </OuterContainer>
    </main>
  );
}
